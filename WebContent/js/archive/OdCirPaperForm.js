/**
 * @author
 * @createtime
 * @class OdCirPaperForm
 * @extends Ext.Window
 * @description OdCirPaper表单
 * @company 捷达世软件
 */
OdCirPaperForm = Ext.extend(Ext.Window, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 必须先初始化组件
				this.initUIComponents();
				OdCirPaperForm.superclass.constructor.call(this, {
							id : 'OdCirPaperFormWin',
							layout : 'form',
							//layout : 'fit',
							//items : this.formPanel,
							items : this.gridPanel,
							modal : true,
							height : 400,
							width : 600,
							maximizable : true,
							title : '传阅件详细信息',
							buttonAlign : 'center'
						});
			},// end of the constructor
			// 初始化组件
			initUIComponents : function() {
				//gridPanel添加 xt start
				this.store = new Ext.data.Store({
					proxy : new Ext.data.HttpProxy({
								url : __ctxPath + '/archive/searchByPaperIdOdCirUser.do?cirPaperId='+this.cirPaperId
							}),
							autoLoad:true,
							reader : new Ext.data.JsonReader({
										root : 'result',
										totalProperty : 'totalCounts',
										fields : [{
													name : 'cirUserId',
													type : 'int'
												}, 'odCirPaper.subject', 'path',
												'odCirPaper.cirPaperId',
												'sendUser.fullname',
												'recUser.fullname', 'isRead',
												'readDate']
									}),
							remoteSort : true
				});
		if (this.cirPaperId != null && this.cirPaperId != '' && this.cirPaperId != "") {
			this.store.load({
						params : {
							'cirPaperId' : this.cirPaperId,
							start : 0,
							limit : 25
						}

					});
		}		
	
		//var sm = new Ext.grid.CheckboxSelectionModel();
		var cm = new Ext.grid.ColumnModel({
					columns : [ new Ext.grid.RowNumberer(),{
						header : 'cirUserId',
						dataIndex : 'cirUserId',
						hidden : true
					}, {
						header : '标题',
						dataIndex : 'odCirPaper.subject'
					}, {
						header : '发件人',
						dataIndex : 'sendUser.fullname'
					}, {
						header : '收件人',
						dataIndex : 'recUser.fullname'
					}, {
						header : '状态',
						dataIndex : 'isRead',
						renderer : function(value) {
							if (value == 0) {
								return '<font color="red">未阅</font>';
							} else if (value == 1) {
								return '<font color="green">已阅</font>';
							}
						}
					}, {
						header : '收阅日期',
						dataIndex : 'readDate'
					}],
					defaults : {
						sortable : true,
						menuDisabled : true,
						width : 100
					}
				});// end of the cm
		// this.roomId=Ext.getCmp("BoardrooForm").getCmp('boardroo.roomId').getValue();

		
		this.gridPanel = new Ext.grid.GridPanel({
					id : 'OdCirPaperFormGrid',
					tbar : this.topbar,
					region : 'center',
					store : this.store,
				    trackMouseOver : true,
					disableSelection : false,
					loadMask : true,				
					//clicksToEdit:1,
				    stripeRows:true,
					height :370,
					cm : cm,
					//sm : sm,		
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

				
				//gridpanel end xt 

			}// end of the initcomponents

		});
