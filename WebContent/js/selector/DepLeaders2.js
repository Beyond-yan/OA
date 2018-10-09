/**
 * 部门选择器
 */
var DepLeaders2 = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(callback, isSingle, map,_url) {
		var url = __ctxPath + '/system/dep3LeadersTreeDepartment.do?a=1';
		if(_url){
			url = _url;
		}
		var cleared = true;
		
		var form = new Ext.form.FormPanel({				
			border : false,
			frame : true,
			width : 290,
			layout:'hbox',
			defaults:{
				style:'padding-right:10px;'
			},
			items:[{
				xtype:'label',
				text:'姓名:'
			},{
				xtype:'textfield',
				name:'depLeaders_fullname_LK'
			},{
				xtype:'button',
				text:'查询',
				handler:function(){
					tree.root.reload();
					tree.getRootNode().expand(true);
				}
			}]
		});
		var tree = new Ext.tree.TreePanel({
			// title: 'My Task List',
			height : 300,
			width : 290,
			useArrows : true,
			autoScroll : true,
			animate : false,
			enableDD : false,
			containerScroll : true,
			rootVisible : false,
			frame : true,
			root : {
				nodeType : 'async'
			},
			dataUrl : url,
			/*loader : new Ext.tree.TreeLoader({
				url : url
			}),*/
			listeners : {
				beforeload : function contextmenu(node, e) {
					loading = new Ext.LoadMask(tree.getEl(),{
			            msg : '加载中...',
			            removeMask : true// 完成后移除
			        });
			        loading.show();
			         
					var name = form.getCmpByName('depLeaders_fullname_LK');
					tree.getLoader().baseParams = {
						nameLK:name.getValue()
					}
					//tree.getLoader().url = url+"&nameLK="+name.getValue();
				},
				load : function(node){
					tree.getRootNode().expand(false);
					loading.hide();
				},
				checkchange : function(node, checked) {
					if (cleared && checked) {
						node.expand(true);
						if(isSingle==2&&node.childNodes!=""){//选择管理处室所有人员
							cleared = false;
							var nodes = node.childNodes;
							for(var i=0;i<nodes.length;i++){
								nodes[i].getUI().toggleCheck(true);
								nodes[i].attributes.checked = true;
							}
							cleared = true;
						}
						else if (isSingle==2&&node.childNodes=="") {
							cleared = false;
							node.getUI().toggleCheck(true);
							node.attributes.checked = true;
							cleared = true;
						}
						else if (isSingle) {
							var nodes = tree.getChecked();
							for(var i=0,len=nodes.length;i<len;i++){
								nodes[i].getUI().toggleCheck(false);
								nodes[i].attributes.checked = false;
							}
							cleared = false;
							node.getUI().toggleCheck(true);
							node.attributes.checked = true;
							cleared = true;
						}
					}else{
						if(isSingle==2&&node.childNodes!=""){//选择管理处室所有人员
							cleared = false;
							var nodes = node.childNodes;
							for(var i=0;i<nodes.length;i++){
								nodes[i].getUI().toggleCheck(false);
								nodes[i].attributes.checked = false;
							}
							cleared = true;
						}
					}
				}
			}
		});
		
		
		var window = new Ext.Window({
			title : '请选择',
			iconCls : 'menu-department',
			width : 300,
			height : 400,
			resizable :false,
			border : false,
			frame : true,
			items : [ form,tree ],
			modal : true,
			buttonAlign : 'center',
			buttons : [{
						iconCls : 'btn-ok',
						text : '确定',
						handler : function() {
							var userIds = '', userNames = '', selNodes = tree
									.getChecked();
							Ext.each(selNodes, function(node) {
								if(node.childNodes==""){
									if (userIds.length > 0) {
										userIds += ',';
									}
									if (userNames.length > 0) {
										userNames += ',';
									}
									userIds += node.id;
									userNames += node.text;
								}
							});

							if (callback != null) {
								callback.call(this, userIds, userNames);
							}
							window.close();
						}
					}, {
						text : '取消',
						iconCls : 'btn-cancel',
						handler : function() {
							window.close();
						}
					} ]
		});
		return window;
	}
/*//tree  是个Ext.tree.TreePanel对象
         var roonodes = tree.getRootNode().childNodes;   //获取主节点
         findchildnode(roonodes);  //开始递归
          
         function findchildnode(node){
             var childnodes = node.childNodes;
             for(var i=0;i<childnodes.length;i++){  //从节点中取出子节点依次遍历
                 var rootnode = roonodes[i];
                 if (rootnode.id == id){
                     rootnode.checked = true;
                     rootnode.parentNode.checked = true;
                 }
                 alert(rootnode.text);
                 if(rootnode.childNodes.length>0){  //判断子节点下是否存在子节点，个人觉得判断是否leaf不太合理，因为有时候不是leaf的节点也可能没有子节点
                     findchildnode(rootnode);    //如果存在子节点  递归
                 }    
             }
         }*/
};