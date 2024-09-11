function send() {
   var input_msg = document.getElementById('msg_text').value;
   var tb = document.getElementById('tb');
   if (input_msg != '') {
      var new_msg = document.createElement('div');
      new_msg.setAttribute('class', 'msg');
      var newId = generateUniqueId();
      new_msg.setAttribute('id', newId);
      tb.appendChild(new_msg);
      var msg_box = document.getElementById(newId);
      var msg_text = document.createElement('span');
      msg_text.innerText = input_msg;
      announce("message send successfully");
      msg_box.appendChild(msg_text);
      const user_msg = input_msg;
      document.getElementById('msg_text').value = '';
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
         if (this.readyState == 4 && this.status == 200) {
            const responseData = JSON.parse(xhttp.responseText);
            const answerValue = responseData.answer;
            var ai_msg = document.createElement('div');
            ai_msg.setAttribute('class', 'msg1');
            var newId = generateUniqueId();
            ai_msg.setAttribute('id', newId);
            tb.appendChild(ai_msg);
            var ai_msg_box = document.getElementById(newId);
            var ai_msg_text = document.createElement('span');
            ai_msg_text.innerText = answerValue;
            ai_msg_box.appendChild(ai_msg_text);

            // Add copy button
            var copyButton = document.createElement('button');
            copyButton.innerText = 'Copy';
            copyButton.classList.add('btn', 'copy-btn');
            ai_msg_text.focus();
            announce("BTA AI replied");
            copyButton.addEventListener('click', function() {
                navigator.clipboard.writeText(answerValue);
                announce("message copied");
            });
            ai_msg_box.appendChild(copyButton);
         }
         tb.scrollTop = tb.scrollHeight;
      };
      xhttp.open("POST", "https://geminigptai.com/api?prompt=" + `Generate an article on ${user_msg}.
instructions:
(Use simple words and simple language So that the article can be understood easily.
Use the standard format of article with headings, sub headings and lists.
Make sure that article contains Headings for introduction and conclusion always.
Don't make the article complex, This should be easily understandable to the readers.
Explain the content of the article well, it should be detailed And elaborated.
Don't use high quality words or other words that makes the article AI generated.
Use a humanly tone in article, so it should not look AI generated, Instead, it should look like it was written entirely by human.
Generate at least 400 words For the article, you can generate more words but 400 Words is minimum. .
Format this article in HTML tags which should be fairly organized Under the article tag, But don't use tags that aren't needed.
Don't insert boiler plate of HTML5 also.
don't use heading level 1 tag, use heading level 2 or other headings instead.
break a paragraph of a heading into more than one paragraph tags so that each heading must has two to three paragraphs, It should not be the case that the content of each heading is placed in just one paragraph tag.
After the article, also provide Relative and Kachi title, relative meta discription and keywords in seperate seperate lines, But not in HTML tags, in normal text .
Also provide a text that can be share with article's link for promoting, this text should short and attractive that attracts users to read article, But this text should also not look AI generated And don't use high quality words in this also.
At the end tell how many words available in article.)

Analyse the above instructions carefully and then generate the article.
Using high quality words or phrases is strictly prohibited.
To generate the article you must follow the above instructions, It is very much necessary.`, true);
      xhttp.send();
   }
}

document.getElementById('refreshButton').addEventListener('click', function() {
    var messages = document.querySelectorAll('.msg, .msg1');
    for (var i = 0; i < messages.length; i++) {
        messages[i].parentNode.removeChild(messages[i]);
        announce("chat refreshed successfully");
    }
    var tb = document.getElementById('tb');
    tb.scrollTop = 0;
});

function generateUniqueId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}
