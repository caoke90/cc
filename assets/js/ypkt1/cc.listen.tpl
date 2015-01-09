<div class="block listen" emit="container">
    <div class="title">
        <%-title%>
    </div>
    <div class="titleimg">
        <audio id="audio" src="<%=cc.theDataPath%>/images/<%=audio%>">您的浏览器不支持 audio 标签。</audio>
    </div>
    <div class="module">
        <ul>
            <%$(options).each(function(k,v){%>
            <li><%=v.text%></li>
            <%})%>
        </ul>
    </div>
</div>