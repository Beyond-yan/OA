/**
 * 部门选择器
 */
var DepLeaders4 = {
	/**
	 * @param callback
	 *            回调函数
	 * @param isSingle
	 *            是否单选
	 */
	getView : function(callback, isSingle, selIds, map,_url) {
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
				handler:/*function(){
					tree.root.reload();
					tree.getRootNode().expand(true);
				}*/function() {
					 var name = form.getCmpByName('depLeaders_fullname_LK').getValue();
					 var roonodes = tree.getRootNode();   //获取主节点
					 roonodes.expand(true);
					 findchildnode(roonodes);
					 function findchildnode(roonodes){
						 var j=0;
						 var childNodes=roonodes.childNodes;
						 for(var i=0;i<childNodes.length;i++){
							 var childNode=childNodes[i];
							 if(!childNode.isLeaf()){
								 if ((!name) || name == null || name == '') {
									 childNode.collapseChildNodes();
								 }
								 findchildnode(childNode);
							 }else{
								 if ((!name) || name == null || name == '') {
									 childNode.parentNode.ui.show();
									 childNode.ui.show();
									 continue;
								 }
								 if(childNode.text.indexOf(name)!=-1){
									 childNode.parentNode.ui.show();
									 childNode.ui.show();
									 //alert(childNode.text);
								 }else{
									 j++;
									 childNode.ui.hide();
								 }
								 if(childNodes.length==j){
									 childNode.parentNode.ui.hide();
								 }
							 }
						 }
					 }
					 
					//tree.root.reload();
					//tree.getRootNode().expand(true);
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
				load : function(){
					tree.getRootNode().expand(true);
					loading.hide();
					if(selIds && selIds != ''){
						var ids = selIds.split(",");
						for(var i= 0; i < ids.length; i++){
							tree.getNodeById(ids[i]).ui.toggleCheck(true); 
						}
					}
				},
				checkchange : function(node, checked) {
					if (cleared && checked) {
						if (isSingle) {
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
								if (userIds.length > 0) {
									userIds += ',';
								}
								if (userNames.length > 0) {
									userNames += ',';
								}
								userIds += node.id;
								userNames += node.text;
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

};