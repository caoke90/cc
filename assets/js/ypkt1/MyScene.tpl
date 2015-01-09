<div emit="body">
    <header>
        <div class="nav">
            <div class="title">
                <ul>
                    <%$(textSelect).each(function(k,v){%>
                    <li style="width:<%=((100-textSelect.length*4-2)/textSelect.length)%>%;"><%=v%></li>
                    <%})%>
                </ul>
            </div>
        </div>
    </header>
    <div class="container" recive="container"></div>
    <footer recive="footer">

    </footer>
</div>
