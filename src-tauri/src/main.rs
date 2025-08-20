use std::collections::HashSet;
use std::io::Write;

use chrono::{Datelike, Utc};
use serde::Serialize;

#[tauri::command]
fn check_git() -> bool {
    which::which("git").is_ok()
}

#[tauri::command]
fn git_authors(repo_path: String) -> Result<Vec<String>, String> {
    let repo = git2::Repository::open(repo_path).map_err(|e| e.to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.to_string())?;
    revwalk.push_head().map_err(|e| e.to_string())?;
    let mut set = HashSet::new();
    for oid in revwalk {
        let oid = oid.map_err(|e| e.to_string())?;
        let commit = repo.find_commit(oid).map_err(|e| e.to_string())?;
        let author = commit.author();
        if let Some(email) = author.email() {
            set.insert(email.to_string());
        }
    }
    Ok(set.into_iter().collect())
}

#[derive(Serialize)]
struct CommitHeader {
    globalProject: String,
    client: String,
    project: String,
    commitHash: String,
    author: String,
    authorEmailGit: String,
    authorEmailPlain: String,
    dateIso: String,
    researchLine: Option<String>,
}

#[tauri::command]
fn git_commits_by_month(repo_path: String, year: i32, month: u32) -> Result<Vec<CommitHeader>, String> {
    let repo = git2::Repository::open(repo_path).map_err(|e| e.to_string())?;
    let mut revwalk = repo.revwalk().map_err(|e| e.to_string())?;
    revwalk.push_head().map_err(|e| e.to_string())?;
    let mut commits = Vec::new();
    for oid in revwalk {
        let oid = oid.map_err(|e| e.to_string())?;
        let commit = repo.find_commit(oid).map_err(|e| e.to_string())?;
        let time = commit.time();
        let dt = chrono::NaiveDateTime::from_timestamp_opt(time.seconds(), 0).unwrap();
        if dt.year() == year && dt.month() == month {
            commits.push(CommitHeader {
                globalProject: String::new(),
                client: String::new(),
                project: String::new(),
                commitHash: commit.id().to_string(),
                author: commit.author().name().unwrap_or_default().to_string(),
                authorEmailGit: commit.author().email().unwrap_or_default().to_string(),
                authorEmailPlain: String::new(),
                dateIso: chrono::DateTime::<Utc>::from_utc(dt, Utc).to_rfc3339(),
                researchLine: None,
            });
        }
    }
    Ok(commits)
}

#[tauri::command]
async fn zip_evidence(files: Vec<String>, output_zip: String) -> Result<String, String> {
    use zip::write::FileOptions;
    let file = std::fs::File::create(&output_zip).map_err(|e| e.to_string())?;
    let mut zip = zip::ZipWriter::new(file);
    let options = FileOptions::default().compression_method(zip::CompressionMethod::Deflated);
    for name in files {
        zip.start_file(name, options).map_err(|e| e.to_string())?;
        zip.write_all(b"placeholder").map_err(|e| e.to_string())?;
    }
    zip.finish().map_err(|e| e.to_string())?;
    Ok(output_zip)
}

#[tauri::command]
async fn upload_with_sas(file: String, sas_url: String) -> Result<(), String> {
    let bytes = tokio::fs::read(file).await.map_err(|e| e.to_string())?;
    reqwest::Client::new()
        .put(&sas_url)
        .body(bytes)
        .send()
        .await
        .map_err(|e| e.to_string())?
        .error_for_status()
        .map(|_| ())
        .map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            check_git,
            git_authors,
            git_commits_by_month,
            zip_evidence,
            upload_with_sas
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::tempdir;

    #[test]
    fn git_authors_finds_email() {
        let dir = tempdir().unwrap();
        let repo = git2::Repository::init(dir.path()).unwrap();
        let sig = git2::Signature::now("Alice", "alice@example.com").unwrap();
        let mut index = repo.index().unwrap();
        let tree_id = index.write_tree().unwrap();
        let tree = repo.find_tree(tree_id).unwrap();
        repo.commit(Some("HEAD"), &sig, &sig, "msg", &tree, &[]).unwrap();
        let authors = git_authors(dir.path().to_string_lossy().to_string()).unwrap();
        assert_eq!(authors, vec!["alice@example.com".to_string()]);
    }
}
