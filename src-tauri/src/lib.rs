use reqwest::header::{HeaderMap, USER_AGENT};
use serde::Serialize;
use tauri::command;

#[derive(Serialize)]
struct FetchResult {
    html: String,
}

#[derive(Serialize)]
struct FetchError {
    error: String,
    status: u16,
}

#[command]
async fn fetch_webpage_content(url: String) -> Result<FetchResult, FetchError> {
    let mut headers = HeaderMap::new();
    headers.insert(
        USER_AGENT,
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            .parse()
            .unwrap(),
    );

    let client = reqwest::Client::new();
    match client.get(&url).headers(headers).send().await {
        Ok(response) => {
            let status = response.status().as_u16();
            if !response.status().is_success() {
                return Err(FetchError {
                    error: "Failed to fetch the webpage".into(),
                    status,
                });
            }
            match response.text().await {
                Ok(html) => Ok(FetchResult { html }),
                Err(_) => Err(FetchError {
                    error: "Failed to read response body".into(),
                    status,
                }),
            }
        }
        Err(_) => Err(FetchError {
            error: "Network request failed".into(),
            status: 0,
        }),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fetch_webpage_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
