/**
 * @author:
 * @class SealView
 * @extends Ext.Panel
 * @description [Seal]管理
 * @company 广州宏天软件有限公司
 * @createtime:
 */
SealView = Ext.extend(Ext.Panel, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				SealView.superclass.constructor.call(this, {
							id : 'SealView',
							title : '印章管理',
							iconCls:'menu-seal',
							region : 'center',
							layout : 'border',
							items : [this.searchPanel, this.gridPanel]
						});
			},// end of constructor
			// 初始化组件
			initUIComponents : function() {
				// 初始化搜索条件Panel
				this.searchPanel=new Ext.FormPanel({
				    layout : 'column',
				    region:'north',
				    height:40,
					bodyStyle: 'padding:6px 10px 6px 10px',
					border:false,
					defaults:{
						border:false
					},
				    items : [
				    		{
				    			columnWidth:.6,
				    			layout:'form',
				    			items:{
					    			fieldLabel:'模板名称',
					    			name:'Q_tempName_S_LK',
					    			anchor:'96%,96%',
					    			xtype:'textfield'
				    			}
				    		},{
				    			columnWidth:.07,
				    			layout:'form',
				    			items:{
									xtype : 'button',
									text : '查询',
									iconCls : 'search',
									handler : this.search.createCallback(this)
				    			}
							},{
				    			//columnWidth:.1,
				    			layout:'form',
				    			items:{
									xtype : 'button',
									text : '重置',
									iconCls : 'btn-reset',
									handler : this.reset.createCallback(this)
				    			}
							}
						]
				});//end of the searchPanel

				this.topbar = new Ext.Toolbar({
							items : [{
								iconCls : 'btn-add',
								text : '添加印章模板',
								xtype : 'button',
								handler:this.createRecord
							}, {
								iconCls : 'btn-del',
								text : '删除印章模板',
								xtype : 'button',
								handler :this.delRecords,
								scope: this
							},{
								iconCls : 'btn-password',
								text : '修改密码',
								xtype : 'button',
								handler :this.alterRecords
							}]
						});

				this.gridPanel = new HT.GridPanel({
					region : 'center',
					tbar : this.topbar,
					// 使用RowActions
					rowActions : true,
					id : 'sealTemplateGrid',
					url : __ctxPath+"/archive/listArchTemplate.do?Q_isGenre_L_EQ=1",
					fields : [{name : 'templateId',type:'int'}, 'archivesType', 'tempName', 'tempPath','fileId','userName'],
					columns : [{
								header : 'ptemplateId',
								dataIndex : 'ptemplateId',
								hidden : true
							}/*,{
								header : '所属类型',
								dataIndex : 'archivesType',
								renderer:function(val){
									if(val!=null){
										return val.typeName;
									}
								}
							}*/, {
								header : '印章名称',
								dataIndex : 'tempName'
							}, {
								header : '创建人',
								dataIndex : 'userName'
							}
//							, {
//								header : '模板路途',
//								dataIndex : 'path'
//							}
//							, {
//								header : '是否启用',
//								dataIndex : 'isActivate'
//							}
							, new Ext.ux.grid.RowActions({
										header : '管理',
//										width : 200,
										actions : [{
													iconCls : 'btn-del',
													qtip : '删除',
													style : 'margin:0 3px 0 3px'
												}
												, {
													 iconCls:'btn-edit',
													 qtip:'编辑',
													 style:'margin:0 3px 0 3px'
												}
												/*,{
												     iconCls:'btn-edit-online',
												     qtip:'在线修改',
												     style:'margin:0 3px 0 3px'
												}*/],
										listeners : {
											scope : this,
											'action' : this.onRowAction
										}
									})]
						// end of columns
				});

				this.gridPanel.addListener('rowdblclick', this.rowClick);

			},// end of the initComponents()
			/**
			 * 
			 * @param {} self 当前窗体对象
			 */
			search:function(self){
				if(self.searchPanel.getForm().isValid()){//如果合法
						self.searchPanel.getForm().submit({
							waitMsg:'正在提交查询',
							url:__ctxPath+'/archive/listArchTemplate.do',
							params:{'Q_archivesType.typeId_L_EQ':self.typeId,
								'Q_isGenre_L_EQ':1},
							success:function(formPanel,action){
					            var result=Ext.util.JSON.decode(action.response.responseText);
					            self.gridPanel.getStore().loadData(result);
							}
					});
				}
			},
			// 重置查询表单
			reset : function(self) {
				self.searchPanel.getForm().reset();
			},
			// GridPanel行点击处理事件
			rowClick : function(grid, rowindex, e) {
				grid.getSelectionModel().each(function(rec) {
							new PaintTemplateForm({
										ptemplateId : rec.data.ptemplateId
									}).show();
						});
			},
			/**
			 * 添加记录
			 */
			createRecord:function(){
				new ArchTemplateForm({isGenre:1}).show();
			},
			/**
			 * 按IDS删除记录
			 * @param {} ids
			 */
			delByIds:function(ids,gridPanel){
				Ext.Msg.confirm('信息确认','您确认要删除所选记录吗？',function(btn){
					if(btn=='yes'){
						Ext.Ajax.request({
										url:__ctxPath+'/archive/multiDelArchTemplate.do',
										params:{ids:ids},
										method:'POST',
										success:function(response,options){
											Ext.ux.Toast.msg('操作信息','成功删除所选公文分类！');
											gridPanel.getStore().reload();
										},
										failure:function(response,options){
											Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
										}
									});
					}
				});//end of comfirm
			},
			/**
			 * 删除多条记录
			 */
			delRecords:function(){
				var selectRecords = this.gridPanel.getSelectionModel().getSelections();
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				}
				var ids = Array();
				for (var i = 0; i < selectRecords.length; i++) {
					ids.push(selectRecords[i].data.templateId);
				}
				this.delByIds(ids,this.gridPanel);
			},

			/**
			 * 编辑记录
			 * @param {} record
			 */
			editRecord:function(record){
				new ArchTemplateForm({templateId:record.data.templateId}).show();
			},
			/**
			 * 修改密码
			 */
			alterRecords:function(){
				new ArchTemplatePasswordForm({isGenre:1}).show();
			},
			/**
			 * 管理列中的事件处理
			 * @param {} grid
			 * @param {} record
			 * @param {} action
			 * @param {} row
			 * @param {} col
			 */
			onRowAction:function(gridPanel, record, action, row, col) {
				switch(action) {
					case 'btn-del':
						this.delByIds(record.data.templateId,gridPanel);
						break;
					case 'btn-edit':
						this.editRecord(record);
						break;
					case 'btn-readdocument':
						new DocumentTemplateForm(record.data.fileId,record.data.tempPath).show();
						break;
					default:
						break;
				}
			}
		});
