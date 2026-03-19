//dom要素の取得
const memoForm = document.getElementById("memo-form");
const memoTitle = document.getElementById("memo-title");
const memoBody = document.getElementById("memo-body")
const memoId = document.getElementById("memo-id");
const memoList =document.getElementById("memo-list");
const btnCreate = document.getElementById("btn-create");
const btnUpdate = document.getElementById("btn-update");
const btnDelete = document.getElementById("btn-delete");
const btnCancel = document.getElementById("btn-cancel");

//メモ一覧を追記するAPIからメモ一覧を取得して画面に表示する関数(fetchMemos)
async function fetchMemos() {
    //GETリクエストを送信
    const response = await fetch("/api/memos");
    //request.json()でレスポンスのJSONを解析(バース)
    const memos = await response.json();

    //メモ一覧エリアを空にする
    memoList.innerHTML = "";

    if (memos.length === 0){
        memoList.innerHTML ='<p class = "empty-message">メモがまだありません。上のフォームから作成してみましょう。</p>'
        return;
    }

    //書くメモをカードとして表示
    memos.forEach (function(memo){
        //document.create("div")でdiv要素を作成する
        const card = document.createElement("div");
        card.className = "memo-card"
        //要素の中をHTMLで設定する
        card.innerHTML =
            "<h3>" + memo.title + "</h3>" +
            "<p>" + memo.body + "</p>" +
            '<span class= "memo-date">更新: ' + memo.update_at + "</span>";

        //カードをクリックしたらメモを選択
        //クリック時に登録する関数を登録する
        card.addEventListener("click", function() {
            selectMemo (memo);
            //選択状態のスタイルをつける
            document.querySelectorAll(".memo-card").forEach(function(c){
                c.classList.remove("selected")
            });
            card.classList.add("selected");
            });
        //親要素の中に小要素を追加する    
        memoList.appendChild(card);
    });
}

//フォームの内容をAPIに送信してメモを作成する関数
async function createMemo() {
    var title = memoTitle.value.trim();
    var body = memoBody.value.trim();

    if(!title || !body) {
        alert("タイトルと本文を入力してください");
        return;
    }

    await fetch("/api/memos", {
        //メソッドの指定
        method: "POST",
        //リクエストヘッダー。JSONを送ることを伝える
        headers: {
            "Content-Type": "application/json", 
        },
        //JSON.stringifyでJavaScriptのオブジェクトをJSONに変換
        body: JSON.stringify({
            title: title, 
            body: body
        }),
    });
    resetForm();
    fetchMemos();
}

//メモを選択する
function selectMemo(memo) {
    memoId.value =memo.id;
    memoTitle.value =memo.title;
    memoBody.value=memo.body;

    //ボタンの状態を切り替え
    btnCreate.disabled = true;
    btnUpdate.disabled =false;
    btnDelete.disabled = false;
}

//メモを更新する
async function updateMemo() {
    var id = memoId.value;
    var title = memoTitle.value.trim();
    var body = memoBody.value.trim();

    if(!title || !body) {
        alert("タイトルと本文を入力してください。");
        return;
    }
    await fetch("/api/memos/" + id, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title:title, body:body
        }),
    });

    resetForm();
    fetchMemos();
}

//メモを削除する
async function deleteMemo() {
    var id = memoId.value;
    //confirm()は確認ダイアログを表示する関数
    if(!confirm("このメモを削除してもいいですか？")) {
        return;
    }

    await fetch("/api/memos/" + id,{
        method: "delete",
    });
    resetForm();
    fetchMemos();
}

//フォームをリセットする
function resetForm() {
    memoId.value = "";
    memoTitle.value = "";
    memoBody.value = "";

    //ボタンの状態を初期状態に戻す
    btnCreate.disabled =false;
    btnUpdate.disabled =true;
    btnDelete.disabled =true;

    //選択状態を解除
    document.querySelectorAll(".memo-card").forEach(function(c){
        c.classList.remove("selected");
    });
}

//イベントリスナーの登録
//各ボタンのクリックイベントページの読み込み時の処理を登録する
//フォームを送信
memoForm.addEventListener("submit",function(e){
    e.preventDefault();
    createMemo();
});

//更新ボタン
btnUpdate.addEventListener("click", updateMemo);

//削除ボタン
btnDelete.addEventListener("click", deleteMemo);

//キャンセルボタン
btnCancel.addEventListener("click", resetForm);

//ページ読み込み時にメモを一覧を取得する
fetchMemos();

