window.onload = function () {
    // 数据模拟
    var data = {
        files: [
            {
                id: 0,
                pid: -1,
                title: '微云',
                type:'file'
            },
            {
                id: 2,
                pid: 0,
                title: '我的音乐',
                type:'file'
            },
            {
                id: 222,
                pid: 2,
                title: '毛不易',
                type:'file'
            },
            {
                id: 2221,
                pid: 222,
                title: '消愁',
                type:'file'
            },
            {
                id: 2222,
                pid: 222,
                title: '像我这样人',
                type:'file'
            },
            {
                id: 2223,
                pid: 222,
                title: '项羽虞姬',
                type:'file'
            },
            {
                id: 2224,
                pid: 222,
                title: '盛夏',
                type:'file'
            },
            {
                id: 223,
                pid: 2,
                title: '袁维娅',
                type:'file'
            },
            {
                id: 2231,
                pid: 223,
                title: '说散就散',
                type:'file'
            },
            {
                id: 2232,
                pid: 223,
                title: '病变',
                type:'file'
            },
            {
                id: 3,
                pid: 0,
                title: '我的抖音',
                type:'file'
            },
            {
                id: 4,
                pid: 0,
                title: '我的课程',
                type:'file'
            },
            {
                id: 444,
                pid: 4,
                title: 'js初级课',
                type:'file'
            },
            {
                id: 445,
                pid: 4,
                title: 'js中级课',
                type:'file'
            },
            {
                id: 446,
                pid: 4,
                title: 'js高级课',
                type:'file'
            }
        ]
    }

// 通过pid与Id值，筛选获取data数据下的子数据
    function getChildren(arr, pid) {
        var newArr = [];
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].pid == pid) {
                newArr.push(arr[i])
            }
        }
        return newArr;
    }
    // 获取数据的层级
    function getById(data,id) {
    }
// 动态渲染tree-menu元素下的模板---------------------

    function treeHtml(data,treeId) {
        var child = getChildren(data,treeId)
        var html = '<ul>'
        child.forEach(function (item) {
            html += `<li style="padding-left: 24px" data-current-id="${item.id}" >
                        <div class="bottom" data-id="${item.id}">
                              <span>
                                  <strong >${item.title}</strong>
                                  <i ></i>
                              </span>
                        </div>
                        ${treeHtml(data,item.id)}   
                     </li>`

        })
        html+='</ul>'
        return html;
    }
    //tree-menu下生成的单个文件————
    function creatTreeFile(arr) {
        var newLi=document.createElement('li');
        newLi.style.paddingLeft='24px';
        newLi.dataset.currentId=arr.id
        newLi.innerHTML=`
                   <div class="bottom" data-id="${arr.id}">
                      <span>
                          <strong >${arr.title}</strong>
                          <i ></i>
                      </span>
                   </div>
                   <ul></ul> `
        return newLi
    }
    var treeMenu=document.querySelector('.tree-menu');
    var datas=data.files;
    treeMenu.innerHTML=treeHtml(datas,-1);
//动态渲染文件区域---------------------------------------
    var fileContent=document.querySelector('.file-content ul');
     fileContent.innerHTML =fileContentHtml(datas,0)
    //单个文件模板
    function fileHtml(datas) {
          var html=`
                <input type="checkbox" class="input-no">
                <img src="imgs/denglong.png" > 
                <p>
                    <span class="textEditor">${datas.title}</span>
                    <input type="text" class="editor" >
                </p>
                `
        return html
    }
    //文件内容区域模板
    function fileContentHtml(datas,fileId) {
        var fileData=getChildren(datas,fileId);
        var html='';
        fileData.forEach(function (item) {
            html+= `
            <li data-current-id="${item.id}" class="getLi">
               ${fileHtml(item)}
            </li> `
        })
        return html
    }
    //新建文件夹所需要的Li对象元素
    function newFile(idatas) {
       var newLi=document.createElement('li');
        newLi.className='getLi'
        newLi.dataset.currentId=idatas.id
        newLi.innerHTML=fileHtml(idatas)
        return newLi
    }
 //动态渲染文件导航区域------------------------------------
    var fileNav=document.querySelector('.file-nav ul');
    fileNav.innerHTML=fileNavHtml(datas,0)
    //文件导航区域模板
    function fileNavHtml(datas,fileId) {
        var fileNavData=getParents(datas,fileId).reverse();
        var html='';
        fileNavData.forEach(function (item) {
             html+=`<li>${item.title}</li>`
    })
        return html;
    }
    //通过id 获取该元素数据和其父级的数据
    function getParents(arr,currentId) {
        var newArr=[];
        for (var i=0;i<arr.length;i++){
            if(arr[i].id==currentId){
                newArr.push(arr[i]);
                newArr=newArr.concat(getParents(arr,arr[i].pid));
                break;
            }
        }
        return newArr;
    }
  var hiddenInput=document.querySelector('#hiddenInput');
    //通过点击tree-menu 获取id
    treeMenu.addEventListener('click',function (ev) {
        var ev=ev||event;
        var target=ev.target;
        if(target.className=='bottom'){
            target=target.parentNode;
        }else if(target.nodeName=='STRONG') {
            target = target.parentNode.parentNode.parentNode;
        }
        var currentId=target.dataset.currentId;
        treeFileStyle(currentId)
        fileNav.innerHTML=fileNavHtml(datas,currentId);
        fileContent.innerHTML =fileContentHtml(datas,currentId);
        checkBox ();
        hiddenInput.value=currentId;

    },false)
    //通过点击文件区域文件，获取id 渲染文件
    fileContent.addEventListener('click',function (ev) {
        var ev=ev||event;
        var target=ev.target;
        if(target.nodeName=='IMG'){
            target=target.parentNode;
        }else if(target.nodeName=='P') {
            target = target.parentNode;
        }
        var currentId=target.dataset.currentId;
        treeFileStyle(currentId)
        fileNav.innerHTML=fileNavHtml(datas,currentId);
        fileContent.innerHTML =fileContentHtml(datas,currentId)
        checkBox ()
        hiddenInput.value=currentId;
    })
    //点击文件区域file, 添加左边菜单按钮样式
    function treeFileStyle(fileId) {
        var eve=document.querySelectorAll('.bottom')
        eve.forEach(function (item) {
            item.className='bottom'
            if(item.dataset.id==fileId){
                item.className+=' treeListStyle'
            }
        })
    }
    //鼠标移入文件区域


    checkBox ()
    //点击导航复选框与文件区域复选框
    function checkBox () {
        var aLi = document.querySelectorAll('.getLi')
        var oBtn = document.querySelector('.btn')
        aLi.forEach(function (item) {
            item.addEventListener('mouseenter', function () {
                this.children[0].className = 'btn1'
                this.children[0].addEventListener('click', function (ev) {
                    ev.stopPropagation()
                    if (this.checked) {
                        if (whoSelect().length == aLi.length) {
                            oBtn.checked = true
                        }
                    } else {
                        oBtn.checked = false
                    }
                }, false)
            }, false)
            item.addEventListener('mouseleave', function () {
                if (!this.children[0].checked) {
                    this.children[0].className = 'input-no'
                }
            }, false)
            oBtn.addEventListener('click', function () {
                if (oBtn.checked) {
                    item.children[0].className = 'btn1'
                    item.children[0].checked = true
                } else {
                    item.children[0].checked = false
                }
            }, false)
        })
        function whoSelect() {
            var arr=[];
            aLi.forEach(function (item) {
                if(item.children[0].checked){
                    arr.push(item)
                }
            });
            return arr
        }
    }
    //mouseup事件新建文件夹
    var newFileBtn=document.querySelector('.newFile')

    newFileBtn.addEventListener('mouseup',function () {
        fileContent.insertBefore(newFile({
             title:'',
             id:new Date().getTime()
         }),fileContent.firstElementChild);
        var firstElement = fileContent.firstElementChild;
        var textEditor=firstElement.querySelector('.textEditor')
        var editor=firstElement.querySelector('.editor')

        // editor.onclick=function (ev) {
        //     ev.stopPropagation()
        // }
        textEditor.style.display='none';
        editor.style.display='block';
        editor.focus();
        newFileBtn.isChecked=true;
        checkBox ()
    },false)

    document.addEventListener('mousedown',function () {
        var firstElement = fileContent.firstElementChild;
        var textEditor=firstElement.querySelector('.textEditor')
        var editor=firstElement.querySelector('.editor')
        if(newFileBtn.isChecked){
            if(editor.value===''){
                fileContent.firstElementChild.remove();
            }else{
                textEditor.style.display='block';
                editor.style.display='none';
                textEditor.innerHTML=editor.value;

                var pid=hiddenInput.value;
                var newdata={
                    id:firstElement.dataset.currentId,
                    pid:pid,
                    title:editor.value,
                    type:'file'
                };
                datas.unshift(newdata);
                console.log(datas)
                var element=document.querySelector('.bottom[data-id="'+pid+'"]');
                var nextElementUl=element.nextElementSibling;
                nextElementUl.appendChild(creatTreeFile({
                    title:editor.value,
                    id:firstElement.dataset.currentId
                }));
                tip()
            }
            newFileBtn.isChecked = !true;
        }
    },false);
    
    function tip() {
        var tip=document.querySelector('.tip');
        tip.style.top='-75px';
        tip.style.transition=0;
        setTimeout(function () {
            tip.style.top=0;
            tip.style.transition='.5s'
        },0)
        setTimeout(function () {
            tip.style.top='-75px';
        },2000)
    }

}