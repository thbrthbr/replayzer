axios({
  method: 'get',
  url: '/get_list',
}).then((res) => {
  let list = res.data.data.reverse();
  let ul = document.querySelector('#list');
  for (let i = 0; i < list.length; i++) {
    let li = document.createElement('li');
    li.id = 'list-item';
    let fileid = list[i].fileid;
    let title = list[i].title.replace('_', ' ');
    li.innerText = title;
    li.onclick = () => {
      window.location.href = `/replay/${fileid}`;
    };
    ul.append(li);
  }
});

const stateUpdate = (files) => {
  if (files.files[0].type !== 'text/html') {
    alert('리플레이 파일만 올릴 수 있습니다');
    $('#replay-upload').val('');
  }
  const READER = new FileReader();
  READER.readAsText(files.files[0], 'EUC-KR');
  let str = '';
  READER.onload = function (e) {
    str = e.target.result;
    if (
      str.includes(
        'html,body {font-family:Verdana, sans-serif;font-size:10pt;margin:0;padding:0;}body{padding:12px 0;} .battle-log {font-family:Verdana, sans-serif;font-size:10pt;} .battle-log-inline {border:1px solid #AAAAAA;background:#EEF2F5;color:black;max-width:640px;margin:0 auto 80px;padding-bottom:5px;} .battle-log .inner {padding:4px 8px 0px 8px;} .battle-log .inner-preempt {padding:0 8px 4px 8px;} .battle-log .inner-after {margin-top:0.5em;} .battle-log h2 {margin:0.5em -8px;padding:4px 8px;border:1px solid #AAAAAA;background:#E0E7EA;border-left:0;border-right:0;font-family:Verdana, sans-serif;font-size:13pt;} .battle-log .chat {vertical-',
      )
    ) {
      if (files.files.length > 0) {
        document.querySelector('.upload-button').style.cssText = `
        background-color : orange;
        color: white;
        border-color: yellow;
      `;
      }
    } else {
      alert('리플레이 파일만 올릴 수 있습니다');
      $('#replay-upload').val('');
    }
  };
};

const upload = async () => {
  const file = document.querySelector('#replay-upload');
  if (file.files.length == 0) {
    alert('파일을 선택해주세요');
    return;
  }
  let prompt = window.prompt('업로드할 리플레이의 제목을 작성해주세요');
  if (prompt == null) {
    return;
  }
  if (prompt.length > 0) {
    if (prompt.length > 100) {
      alert('제목은 100글자 아래로 설정해주세요');
      return;
    }
    prompt = prompt.replace(' ', '_');
    const formData = new FormData();
    formData.append('title', prompt);
    formData.append('replay-upload', file.files[0]);
    let res = await axios({
      method: 'post',
      url: '/replay_upload',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.status == '성공') {
      let li = document.createElement('li');
      li.id = 'list-item';
      let fileid = res.data.fileid;
      let title = res.data.dataName.replace('_', ' ');
      li.innerText = title;
      li.onclick = () => {
        window.location.href = `/replay/${fileid}`;
      };
      document
        .querySelector('#list')
        .insertBefore(li, document.querySelector('#list').firstChild);
      $('#replay-upload').val('');
      document.querySelector('.upload-button').style.cssText = `
        border-color: #accfff;
        color: black;
        background-color: white;
      `;

      alert('업로드 성공');
    } else {
      alert('업로드 실패');
    }
  } else {
    alert('제목은 한 글자 이상 적어주세요');
    upload();
  }
};

const search = async () => {
  let keyword = document.querySelector('.search-input').value;
  keyword = keyword.replace(' ', '_');
  let res = await axios({
    method: 'post',
    url: '/search',
    data: { keyword: keyword },
  });
  if (res.data.status == '성공') {
    let list = res.data.data.reverse();
    let ul = document.querySelector('#list');
    ul.innerHTML = '';
    for (let i = 0; i < list.length; i++) {
      let li = document.createElement('li');
      li.id = 'list-item';
      let fileid = list[i].fileid;
      let title = list[i].title.replace('_', ' ');
      li.innerText = title;
      li.onclick = () => {
        window.location.href = `/replay/${fileid}`;
      };
      ul.append(li);
    }
  } else {
    alert('데이터를 불러오지 못했습니다');
  }
};

const refresh = () => {
  window.location.reload();
};
