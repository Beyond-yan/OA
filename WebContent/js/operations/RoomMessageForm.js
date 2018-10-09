var suffix;
RoomMessageForm = Ext.extend(Ext.Window, {
			// 内嵌FormPanel
			formPanel : null,
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				RoomMessageForm.superclass.constructor.call(this, {
							id : 'RoomMessageFormWin' + this.px,
							layout : 'fit',
							items : this.formPanel,
							modal : true,
							height : 560,
							iconCls : 'menu-suggestbox',
							width : 735,
							maximizable : true,
							title : '意见详细信息',
							buttonAlign : 'center',
							buttons : this.buttons
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				this.formPanel = new Ext.FormPanel({
							layout : 'form',
							bodyStyle : 'padding:10px 10px 10px 10px',
							border : false,
							url : __ctxPath + '/info/rmSaveSuggestBox.do',
							id : 'RoomMessageForm' + this.px,
							defaults : {
								anchor : '95%,95%'
							},
							autoScroll : true,
							defaultType : 'textfield',
							items : [{
										name : 'suggestBox.boxId',
										id : 'boxId',
										xtype : 'hidden',
										value : this.boxId == null
												? ''
												: this.boxId
									}, {
										name : 'suggestBox.status',
										id : 'status',
										xtype : 'hidden',
										value : 1
									}, {
										fieldLabel : '意见类别',
										hiddenName : 'suggestBox.queryPwd',
										id : 'ddlSuggestType',
										allowBlank : false,
										editable : false,
										xtype : 'combo',
										mode : 'local',
										triggerAction : 'all',
										value : '1',
										store : [['1', '宿舍类'], ['2', '食堂类']]
									}, {
										fieldLabel : '意见标题',
										name : 'suggestBox.subject',
										id : 'subject'
									}, {
										fieldLabel : '意见内容',
										name : 'suggestBox.content',
										id : 'content',
										height : '300',
										xtype : 'textarea',
										maxLength : 2000,
										maxLengthText : '最大字符为2000',
										enableKeyEvents : true,
										listeners : {
											keyup : function() {
												var leaderOpinion = Ext
														.getCmp('content')
														.getValue();
												var leftLength = 2000
														- leaderOpinion.length;
												Ext.getCmp('leftLength3')
														.setText(leftLength);
											}
										}
									}, {
									xtype : 'container',
									autoWidth : true,
									items : [{
												xtype : 'label',
												text : '剩余字数:',
												style : 'padding-left:105px;',
												width : 180
											}, {
												xtype : 'label',
												id : 'leftLength3',
												text : '2000'
											}]
								},{
										xtype : 'radiogroup',
										fieldLabel : '是否公开',
										autoHeight : true,
										columns : 2,
										width : 520,
										items : [{
													boxLabel : '公开',
													name : 'suggestBox.isOpen',
													inputValue : 0,
													id : 'isOpen1',
													checked : true
												}, {
													boxLabel : '不公开',
													name : 'suggestBox.isOpen',
													inputValue : 1,
													id : 'isOpen0'
												}]
									}, {
										xtype : 'fieldset',
										title : '个人信息',
										id : 'PersonalInfo',
										defaults : {
											anchor : '95%,95%'
										},
										defaultType : 'textfield',
										layout : 'form',
										items : [{
											xtype : 'container',
											layout : 'column',
											defaultType : 'textfield',
											items : [{
												fieldLabel : '发送人ID',
												name : 'suggestBox.senderId',
												id : 'senderId',
												xtype : 'hidden',
												value : curUserInfo != null
														? curUserInfo.userId
														: null
											},

											{
												xtype : 'label',
												text : '发送人',
												width : 103
											}, {
												name : 'suggestBox.senderFullname',
												id : 'senderFullname',
												value : curUserInfo != null
														? curUserInfo.fullname
														: null
											}, {
												xtype : 'label',
												text : '联系电话',
												width : 103
											}, {
												xtype : 'numberfield',
												name : 'suggestBox.phone',
												id : 'phone'
											}]
										}]
									}]
						});

				if (this.px != 'ALL') {
					Ext.getCmp('ddlSuggestType').setValue(this.px);
					Ext.getCmp('ddlSuggestType').readOnly = true;
					suffix = this.px;
				}

				// 加载表单对应的数据
				if (this.boxId != null && this.boxId != 'undefined') {
					this.formPanel.loadData({
								url : __ctxPath
										+ '/info/getSuggestBox.do?boxId='
										+ this.boxId,
								preName : 'suggestBox',
								root : 'data'
							});
				}
				// 初始化功能按钮
				this.buttons = [{
							text : '提交',
							iconCls : 'btn-ok',
							scope : this,
							handler : this.save.createCallback(this.formPanel,
									this)

						}, {
							text : '保存草稿',
							iconCls : 'btn-save',
							scope : this,
							handler : this.draft
						},
						// {
						// text : '重置',
						// iconCls : 'btn-reset',
						// scope : this,
						// handler : this.reset.createCallback(this.formPanel)
						// },
						{
							text : '取消',
							iconCls : 'btn-cancel',
							scope : this,
							handler : this.cancel.createCallback(this)
						}];
			},// end of the initcomponents

			/**
			 * 重置
			 * 
			 * @param {}
			 *            formPanel
			 */
			reset : function(formPanel) {
				formPanel.getForm().reset();
			},
			/**
			 * 取消
			 * 
			 * @param {}
			 *            window
			 */
			cancel : function(window) {
				window.close();
			},
			/**
			 * 保存记录
			 */
			save : function(formPanel, window) {
				if (formPanel.getForm().isValid()) {
					Ext.getCmp('status').setValue('1');
					formPanel.getForm().submit({
						method : 'POST',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							//alert('SuggestBoxGrid'+suffix);
							var gridPanel = Ext.getCmp('SuggestBoxGrid'
									+ suffix);
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}
							window.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错,' + action.result.msg,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							window.close();
						}
					});
				}
			},// end of save
			draft : function() {
				Ext.getCmp('status').setValue('0');
				var fm = Ext.getCmp('RoomMessageForm' + suffix);
				var win = Ext.getCmp('RoomMessageFormWin' + suffix);
				if (fm.getForm().isValid()) {
					fm.getForm().submit({
						method : 'POST',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功保存信息！');
							// alert('SuggestBoxGrid'+suffix);
							var gridPanel = Ext.getCmp('SuggestBoxGrid'
									+ suffix);
							if (gridPanel != null) {
								gridPanel.getStore().reload();
							}

							win.close();
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错,' + action.result.msg,
										buttons : Ext.MessageBox.OK,
										icon : Ext.MessageBox.ERROR
									});
							win.close();
						}
					});
				}
			}// end of draft
		});