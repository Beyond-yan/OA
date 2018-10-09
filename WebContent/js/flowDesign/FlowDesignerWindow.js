/**
 * 
 * @class FlowDesingerWindow
 * @extends Ext.Window
 */
FlowDesignerWindow=Ext.extend(Ext.Window,{
	constructor:function(config){
		Ext.applyIf(this,config);
		var html='<APPLET codebase="." id="processEditor" ARCHIVE="' + 
				__ctxPath+'/js/flowDesign/workflow.jar" '+
				'code="com.htsoft.jbpm.designer.ProcessApplet.class" width="100%" height="100%"></APPLET>';
		
		var leftPanel=new Ext.Panel({
			columnWidth:.79,
			/*layout:'fit',*/
			height:485,
			html:html
		});
		
		var formPanel=new Ext.FormPanel({
			url : __ctxPath + '/flow/defSaveProDefinition.do',
			columnWidth:.19,
			layout:'anchor',
			border:true,
			bodyStyle:'margin:6px 0px 0px 0px;background-color:#DFE8F6',
			defaults:{
				anchor:'100%'
			},
			items:[
					{
						name : 'proDefinition.defId',
						id : 'defId',
						xtype : 'hidden',
						value : this.defId == null ? '' : this.defId
					} ,{
						xtype : 'hidden',
						id : 'proTypeId',
						name : 'proDefinition.proTypeId'
					},{
						text:'流程分类',
						xtype:'label'
					},new TreeSelector('proTypeTreeSelector', __ctxPath + '/flow/listProType.do', '流程分类','proTypeId',false),{
						text:'流程的名称',
						xtype:'label'
					},{
						name : 'proDefinition.name',
						xtype:'textfield',
						allowBlank:false,
						id : 'name'
					},{
						text:'描述',
						xtype:'label'
					},{
						xtype:'textarea',
						height:200,
						name : 'proDefinition.description',
						id : 'description'
					},{
						xtype:'hidden',
						height:200,
						name:'proDefinition.drawDefXml',
						id:'drawDefXml'
					}
			]
		});
		
		FlowDesignerWindow.superclass.constructor.call(this,{
			id:'flowDesignerWindow',
			title:'在线流程设计',
			iconCls:'btn-flow-design',
			defaults:{border:false},
			layout:'column',
			height:560,
			width:860,
			modal:true,
			maximizable:true,
			items:[
				leftPanel,
				formPanel
			],
			buttonAlign:'center',
			buttons:[{
					text:'保存',
					scope:this,
					iconCls:'btn-save',
					handler:function(){
						document.getElementById("drawDefXml").value=document.getElementById("processEditor").getData();
						if(formPanel.getForm().isValid()){
							formPanel.getForm().submit({
								method : 'POST',
								waitMsg : '正在提交数据...',
								success : function(fp, action) {
									var proDefinitionGrid=Ext.getCmp("ProDefinitionGrid");
									if(proDefinitionGrid!=null){
										proDefinitionGrid.getStore().reload();
									}
									var proDefinitionGrid0=Ext.getCmp("ProDefinitionGrid0");
									if(proDefinitionGrid0!=null){
										proDefinitionGrid0.getStore().reload();
									}
									
									Ext.getCmp("flowDesignerWindow").close();
								},
								failure : function(fp, action) {
									Ext.MessageBox.show({title : '操作信息',msg : '信息保存出错，请联系管理员！', buttons : Ext.MessageBox.OK,icon : 'ext-mb-error'});
									Ext.getCmp("flowDesignerWindow").close();
								}
							});
						}
					}
				},
				{
					text:'取消',
					scope:this,
					iconCls:'btn-cancel',
					handler:function(){
						Ext.getCmp("flowDesignerWindow").close();
					}
				}
			]
		});
	}
});