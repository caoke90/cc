
<div class="container">
    <div emit="container">
        <div class="block info" >
            <div class="title"><%-title%></div>
            <div class="module">
                <%-content%>
            </div>
        </div>
    </div>
</div>
<footer>
    <div class="audio" style="height: 45px;" emit="footer">
        <div class="left">
            <div class="audio_play"></div>
            <div class="audio_pause"></div>
        </div>
        <div class="right">
            <div class="progress"></div>
            <div class="time">00:00/00:00</div>
        </div>
        <audio id="audio" src="<%=cc.theDataPath%>/images/<%-audio%>">您的浏览器不支持 audio 标签。</audio>
    </div>
</footer>




