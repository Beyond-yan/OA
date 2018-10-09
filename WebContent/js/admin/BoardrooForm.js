/**
 * @author
 * @createtime
 * @class BoardrooForm
 * @extends Ext.Window
 * @description Boardroo表单
 * @company 捷达世软件
 */
BoardrooForm = Ext.extend(Ext.Window, {
	// 构造函数

	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();

		BoardrooForm.superclass.constructor.call(this, {
			id : 'BoardrooFormWin',
			layout : 'form',
			title : '编辑/新增会议室信息',
			iconCls : 'menu-conference_boardroom',
			width : 600,
			border : false,
			modal : true,
			maximizable : true,
			buttonAlign : 'center',
			items : [this.formPanel, this.gridPanel],
			// height : 400,
			buttons : [this.buttons],
			keys : {
				key : Ext.EventObject.ENTER,
				fn : this.save.createCallback(this.formPanel, this),
				scope : this
			}
			});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel({
			url : __ctxPath + '/admin/saveBoardroo.do',
			layout : 'form',
			id : 'BoardrooForm',
			// frame : false,
			frame : true,
			border : true,
			autoScroll:true,			
			defaults : {
				width : 500,
				anchor : '98%,98%'
			},
			bodyStyle : 'padding-top:5px;padding-left:5px;',
			formId : 'BoardrooFormId',
			defaultType : 'textfield',
			items : [{
						// cxt
						layout : 'column',
						xtype : 'fieldset',
						title : '基本信息',
						// columnWidth:.5,
						// autoHeight:true,
						items : [{
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												xtype : 'hidden',
												name : 'boardroo.roomId',
												value : this.roomId,
												id:'Form_boardrooRoomId'

											}, {
												// cxt 会议室使用状态：1为可用，0为不可用
												xtype : 'hidden',
												name : 'boardroo.status',
												// allowBlank:false,
												value : 1
											}, {
												name : 'boardroo.roomname',
												xtype : 'textfield',
												fieldLabel : '会议室名称',
												width : 130,
												allowBlank : false,
												blankText : '会议室名称不能为空！',
												maxLength : 128,
												maxLengthText : '会议室名称不能超过128个字符长度！',
												id:'roomNameId',
												listeners:{change:function(){
													  Ext.Ajax.request({
											               url: __ctxPath +'/admin/listBoardroo.do',
											               params:{
											               	'Q_roomname_S_EQ':Ext.getCmp('roomNameId').getValue()									             
											               },
											               success:  function ( response, options ) {
											                    var dbJson = response.responseText;
											                    dbJson = eval("("+ dbJson + ")");									                 
											                    var tatal=dbJson.totalCounts;
											                    if(tatal>0){
											                     Ext.getCmp('roomNameId').setValue('');
											                      Ext.MessageBox.show({
											                        title : '操作信息',
											                        msg : '输入的会议室名称已存在，请重新输入！'});
											                    }									                  
											                },
											               failure:  function ( result, request ) {
											               	 Ext.getCmp('roomNameId').setValue('');
											                    Ext.MessageBox.show({
											                        title : '操作信息',
											                        msg : '获取会议室名称重复信息出错！'});
											                }
											            });
													  }  											
												 }	
											},
											// cxt 20110505
											{
												xtype : 'textfield',
												name : 'boardroo.location',
												fieldLabel : '位置',
												width : 130,
												allowBlank : false,
												blankText : '请输入位置！',
												maxlength : 50,
												maxLengthText : '您输入的会议室位置信息不能超过25个字！'
											}]
								},

								{
									columnWidth : 0.5,
									layout : 'form',
									items : [
											// cxt 20110505
											{
										xtype : 'textfield',
										name : 'boardroo.code',
										fieldLabel : '会议室编号',
										width : 130,
										allowBlank : false,
										blankText : '请输入会议室编号！',
										maxLength : 50,
										maxLengthText : '您输入的会议室编号信息不能超过25个字！',
										id:'boardrooCodeId',
										listeners:{change:function(){
											  Ext.Ajax.request({
									               url: __ctxPath +'/admin/listBoardroo.do',
									               params:{
									               	'Q_code_S_EQ':Ext.getCmp('boardrooCodeId').getValue()									             
									               },
									               success:  function ( response, options ) {
									                    var dbJson = response.responseText;
									                    dbJson = eval("("+ dbJson + ")");									                 
									                    var tatal=dbJson.totalCounts;
									                    if(tatal>0){
									                     Ext.getCmp('boardrooCodeId').setValue('');
									                      Ext.MessageBox.show({
									                        title : '操作信息',
									                        msg : '输入的会议室编号已存在，请重新输入！'});
									                    }									                  
									                },
									               failure:  function ( result, request ) {
									               	 Ext.getCmp('boardrooCodeId').setValue('');
									                    Ext.MessageBox.show({
									                        title : '操作信息',
									                        msg : '获取会议室编号重复信息出错！'});
									                }
									            });
											  }  											
											 }	

									},

									{
										columnWidth : 0.5,
										xtype : 'numberfield',
										name : 'boardroo.containnum',
										fieldLabel : '容纳人数',
										allowBlank : false,
										blankText : '请输入容纳人数！',
										width : 130,
										validateOnBlur : true,// cxt 20110511
										maxLength : 3,
										maxLengthText : '会议室容纳人数不能超过一千人！'
									}]
								}, {
									columnWidth : 1,
									layout : 'form',
									items : [{
												name : 'boardroo.roomdesc',
												xtype : 'textarea',
												fieldLabel : '描述',
												allowBlank : true,											
												width : 360,
												height : 100,
												maxLength : '4000',
												maxLengthText : '会议室描述不能超过4000个字符长度！'
											}]
								}, {

									columnWidth : 0.5,
									layout : 'form',
									items : [{
												xtype : 'radiogroup',
												fieldLabel : '是否有投影仪',
												// name :
												// 'CONF_ROOM_EQUIP.PROJECTOR',
												// boardroo.projector
												items : [{
													boxLabel : '是',
													// name : 'rb-auto',
													name : 'boardroo.projector',
													inputValue : 1,
													 checked : true
												}, {
													boxLabel : '否',
													// name : 'rb-auto',
													name : 'boardroo.projector',
													inputValue : 0
												}]
											}]
								}]
					}]				
		});
		// 加载表单对应的数据
		if (this.roomId != null && this.roomId != '') {
			this.formPanel.loadData({
				url : __ctxPath + '/admin/getBoardroo.do?roomId=' + this.roomId,
				root : 'data',
				preName : 'boardroo',
				success : function(response, options) {
				},
				failure : function() {
					Ext.ux.Toast.msg('操作提示', '对不起，数据加载失败！');
				}
			});
		}
		this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/admin/listConfRoomEquip.do'
							}),
					reader : new Ext.data.JsonReader({
								root : 'result',
								totalProperty : 'totalCounts',								
								fields : [{
											name : 'id',
											type : 'int'
										}, 'name', 'amount', 'description',
										'roomId']
							}),
					remoteSort : false/*,
					paramNames: {
						"Q_Boardroo.roomId_L_EQ":(this.roomId != null && this.roomId != '' && this.roomId != "")?(this.roomId):""
						}*/
				});
		if (this.roomId != null && this.roomId != '' && this.roomId != "") {
			this.store.setDefaultSort('amount', 'ASC');
			this.store.load({
						params : {
							'Q_Boardroo.roomId_L_EQ' : this.roomId,
							start : 0,
							limit : 25
						}

					});
		}		
		var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [sm, new Ext.grid.RowNumberer(), {
						header : 'id',
						dataIndex : 'id',
						hidden : true,
						autoScroll:true
							// 根据Id删除信息
						}, {
						header : 'roomId',
						dataIndex : 'roomId',
						hidden : true
					}, {
						header : '物品名称',
						dataIndex : 'name',
						editor : new Ext.form.TextField({
									allowBlank : false
								})
					}, {
						header : '数量',
						dataIndex : 'amount',
						editor : new Ext.form.NumberField({
									allowBlank : false,
									maxValue : 1000,
									blankText : '数量不能为空！'
								})
					}, {
						header : '描述',
						dataIndex : 'description',
						editor : new Ext.form.TextField({
									allowBlank : true
								})
					}],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});// end of the cm
		// this.roomId=Ext.getCmp("BoardrooForm").getCmp('boardroo.roomId').getValue();

		this.topbar = new Ext.Toolbar({
					id : 'BoardrooFormtopBar',
					height : 30,
					bodyStyle : 'text-align:right',
					menuAlign : 'center',
					items : []
				});
	  	// 新增
		this.topbar.add(new Ext.Button({
					iconCls : 'btn-add',
					text : '添加',
					scope : this,
					handler : function() {			
						var recordType = this.store.recordType;
						this.store.add(new recordType());
					}
				}));					
		// 删除
		this.topbar.add(new Ext.Button({
			iconCls : 'btn-del',
			text : '删除',
			scope : this,			
			handler : function() {
				var grid = Ext.getCmp("BoardrooFormGrid");
				var selectRecords = grid.getSelectionModel().getSelections();
				var roomInfo = '';
				// var form=Ext.getCom("BoardrooForm");
				if (selectRecords.length == 0) {
					Ext.ux.Toast.msg("信息", "请选择要删除的记录！");
					return;
				} /*else {
					roomInfo = selectRecords[0].data.roomId;					
				}*/
				var ids = new Array();
				for (var i = 0; i < selectRecords.length; i++) {					
					if((null!=selectRecords[i].data.id)&&('undenfied'!=selectRecords[i].data.id)&&(''!=selectRecords[i].data.id)){
					ids.push(selectRecords[i].data.id);
					roomInfo=Ext.getCmp('Form_boardrooRoomId').getValue();
					//roomInfo = selectRecords[i].data.roomId;
					}else{						
						this.store.remove(selectRecords[i],true);							
					}
				}
				if(ids.length>0){//如果存在数据库中的数据要删除				
				Ext.Ajax.request({
							url : __ctxPath + '/admin/multiDelConfRoomEquip.do',
							method : 'post',
							params : {
								ids : ids
							},
							success : function() {								
								Ext.ux.Toast.msg("操作提示", "成功删除所选记录！");															
								if ((roomInfo != null) && (roomInfo != '')) {								
									grid.getStore().reload({
												params : {
													start : 0,
													limit : 25,
													'Q_Boardroo.roomId_L_EQ' : roomInfo
												}
											});									
								}
							},
							failure : function() {
								Ext.ux.Toast.msg('操作提示', '对不起，删除数据操作失败！');
							}
						});
				}
			}
		}));		
		this.gridPanel = new Ext.grid.EditorGridPanel({
					id : 'BoardrooFormGrid',
					tbar : this.topbar,
					region : 'center',
					store : this.store,
				    trackMouseOver : true,
					disableSelection : false,
					loadMask : true,				
					clicksToEdit:1,
				    stripeRows:true,
					height : 150,
					cm : cm,
					sm : sm,		
					viewConfig : {
						forceFit : true,
						autoFill : true
					},
					bbar : new Ext.PagingToolbar({
								pageSize : 25,
								store : this.store,
								displayInfo : true,
								displayMsg : '当前显示从{0}至{1}， 共{2}条记录',
								emptyMsg : "当前没有记录"
							})
				});

		this.buttons = [{
					text : '保存',
					iconCls : 'btn-save',					
					handler : this.save.createCallback(this.formPanel, this)
				}, {
					text : '取消',
					iconCls : 'btn-cancel',
					handler : this.cancel.createCallback(this)
				}];
	},// end of the initcomponents

	/**
	 * 根据Id删除数据
	 */
	/*
	 * delByIds : function(id) { var gd = Ext.getCmp("BoardrooFormGrid");
	 * Ext.MessageBox.confirm("操作提示", "您真的要删除这条数据吗？", function(btn) { if (btn ==
	 * "yes") { Ext.Ajax.request( { url : __ctxPath + '/admin/delTBoardroo.do',
	 * method : 'post', params : { Id : id }, success : function() {
	 * Ext.ux.Toast.msg("操作提示", "成功删除所选记录！"); gd.getStore().reload( { params : {
	 * start : 0, limit : 25 } }); }, failure : function() {
	 * Ext.ux.Toast.msg('操作提示', '对不起，删除数据操作失败！'); } }); } }); },
	 */
	/**
	 * 保存
	 */
	save : function(formPanel, window) {
		var details = [];
		var gridPanel = Ext.getCmp('BoardrooFormGrid');
		if (gridPanel != null) {
			var store = gridPanel.getStore();
			for (var i = 0; i < store.getCount(); i++) {				
				if (store.getAt(i).get('amount') == null) {
					Ext.ux.Toast.msg('操作信息', '数量是必填项!');
					return;
				}
				if (store.getAt(i).get('name') == null) {
					Ext.ux.Toast.msg('操作信息', '物品名称为必填项!');
					return;
				}
				details.push(store.getAt(i).data);
			}
		}		
		if (formPanel.getForm().isValid()) {			
			formPanel.getForm().submit({
						scope : this,
						url : __ctxPath + '/admin/saveBoardroo.do',
						params : {
							details : Ext.encode(details)
						},
						method : 'post',
						waitMsg : '数据正在提交，请稍后...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息!');
							var gridPanel = Ext.getCmp('BoardrooGrid');
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							window.close();
						},
						failure : function(fp, action) {							
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							window.close();
						},
						again: function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，您输入的会议室编号已存在！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							window.close();
							}
					});
		}
	},
	/**
	 * 重置	
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消	
	 * @param {}
	 *            window
	 */
	cancel : function(window) {
		window.close();
	}
		/**
		 * 保存记录
		 */	
});