function doPost(e) {
  try {
    // フォームデータを受け取る
    // e.parameter には HTML から送られたデータが入っている
    // それぞれのキー名は index.html 側で fetch 時に送っている name=... などと一致
    const name = e.parameter.name || "";             // 名前
    const date = e.parameter.date || "";             // 希望日（YYYY-MM-DD）
    const start = e.parameter.startTime || "";       // 開始時間（HH:MM）
    const end = e.parameter.endTime || "";           // 終了時間（HH:MM）
    const notes = e.parameter.notes || "";           // 備考欄
    const duration = e.parameter.durationHours || "";// 希望時間数（小数）
    const sendDatetime = e.parameter.sendDatetime || ""; // 送信日時（クライアント側のISO時刻）

    // スプレッドシートを開く
    // openById() で対象のスプレッドシートを開く
    // ↓「スプレッドシートID」は自分のファイルURLから取得する
    // 例: https://docs.google.com/spreadsheets/d/この部分がID/edit
    const sheet = SpreadsheetApp.openById("19Koy57RZ8t30wNo86B-tp1CzsyRVG9mPMP1oV5qf7dQ").getSheetByName("フォーム回答");

    // スプレッドシートに追記する
    // appendRow() はスプレッドシートの最終行に新しい行を追加する関数
    // 順番は任意だが、ここでは受信日時 → 送信日時 → 名前... の順で保存
    sheet.appendRow([
      new Date(),       // GASサーバーが受け取った実際の時刻（タイムスタンプ）
      sendDatetime,      // クライアント（ブラウザ）での送信時刻（ISO形式）
      name,              // 名前
      date,              // 希望日
      start,             // 開始時間
      end,               // 終了時間
      duration,          // 時間数（小数時間）
      notes              // 備考
    ]);

    // 正常に保存できた場合のレスポンス
    // ブラウザ側に「status: ok」と返す
    // ContentService は GAS の HTTP レスポンスを作るためのサービス
    const res = { status: "ok" };
    return ContentService
      .createTextOutput(JSON.stringify(res)) // JSON文字列に変換
      .setMimeType(ContentService.MimeType.JSON); // MIMEタイプをJSONに設定

  } catch (err) {
    // エラー処理
    // try 内でエラーが起きた場合はここに入る
    // 例：スプレッドシートのIDが間違っている など
    const res = {
      status: "error",    // ステータスを error に
      message: err.message // どんなエラーだったかをメッセージとして返す
    };

    // JSON形式でエラー内容を返す
    return ContentService
      .createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
