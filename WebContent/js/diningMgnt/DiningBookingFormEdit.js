/**
 * @author
 * @createtime
 * @class DiningBookingFormEdit
 * @extends Ext.Window
 * @description DiningBooking表单
 * @company 捷达世软件
 */
function right(mainStr,lngLen) { 
	// alert(mainStr.length) 
	if (mainStr.length-lngLen>=0 && mainStr.length>=0 && mainStr.length-lngLen<=mainStr.length) { 
	return mainStr.substring(mainStr.length-lngLen,mainStr.length);} 
	else{return null;} 
	}; 		

	function delDBdetailRs(conf){
		var ids=$getGdSelectedIds(conf.grid,conf.idName);
		if (ids.length == 0) {
			Ext.ux.Toast.msg("操作信息", "请选择要删除的记录！");
			return;
		}
		var params={
			url:conf.url,
			ids:ids,
			grid:conf.grid,
			formPanel:conf.formPanel,
			callback:conf.callback
		};
		postDBdetailDel(params);
	};
	
	function postDBdetailDel(conf){
		Ext.Msg.confirm('信息确认', '您确认要删除所选记录吗？', function(btn) {
				if (btn == 'yes') {
					Ext.Ajax.request({
						url :conf.url,
						params : {ids : conf.ids,'diningBooking.id':dbid},method : 'POST',
						success : function(response,options) {
							Ext.ux.Toast.msg('操作信息','成功删除该记录！');
							if(conf.callback){
								conf.callback.call(this);								
							}
							
							if(conf.grid){
								conf.grid.getStore().reload();
							}
							
							if (conf.formPanel)
							{											
								conf.formPanel.getForm().load({
									url : __ctxPath + '/diningMgnt/getDiningBooking.do?id='
									+ dbid,
									root : 'data',
									preName : 'diningBooking',
									waitMsg : '正在载入数据...',
									success : function(form, action) {
									
								}
								});
							}							
						},
						failure : function(response,options) {
							Ext.ux.Toast.msg('操作信息','操作出错，请联系管理员！');
						}
					});
				}
		});
	}	
	
	var dbid=0;
		
	function $postDBEditSaveFrm(conf){		
		if(conf.formPanel.getForm().isValid()){			
			//conf.params.ids = ids;
			conf.formPanel.getForm().submit({
					scope:conf.scope?conf.scope:this,
					params:conf.params,
					url : conf.url+'?ids='+conf.ids,
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						Ext.ux.Toast.msg('操作信息', '成功信息保存！');
						if(conf.callback){
							conf.callback.call(this,fp,action);
						}
					},
					failure : function(fp, action) {
						Ext.MessageBox.show({
									title : '操作信息',
									msg : '信息保存出错，请联系管理员！',
									buttons : Ext.MessageBox.OK,
									icon : 'ext-mb-error'
								});
						if(conf.callback){
							conf.callback.call(this);
						}
					}
				});
			}
		};	
		
		function $postHeaderForm(conf){
			
			if(conf.formPanel.getForm().isValid()){
				conf.formPanel.getForm().submit({
						scope:conf.scope?conf.scope:this,
						params:conf.params,
						url : conf.url,
						method : 'post',
						waitMsg : '正在提交数据...',
						success : function(fp, action) {
							Ext.ux.Toast.msg('操作信息', '成功信息保存！');
							if(conf.callback){
								conf.callback.call(this,fp,action);
							}
						},
						failure : function(fp, action) {
							Ext.MessageBox.show({
										title : '操作信息',
										msg : '信息保存出错，请联系管理员！',
										buttons : Ext.MessageBox.OK,
										icon : 'ext-mb-error'
									});
							if(conf.callback){
								conf.callback.call(this);
							}
						}
					});
			}
	}
		
DiningBookingFormEdit = Ext.extend(Ext.Window, {
	// 构造函数
	//containerScroll:true,
	//autoScroll:true,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningBookingFormEdit.superclass.constructor.call(this, {
			id : 'DiningBookingFormEditWin',
			layout : 'form',
			items : [this.formPanel],
			modal : true,
			height : 550,
			width : 800,
			maximizable : true,
			title : '订餐管理详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, {
				text : '重置',
				iconCls : 'btn-reset',
				scope : this,
				handler : this.reset
			}, {
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
				
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类别',
			hiddenName : 'diningBooking.mealtypeid',
			id:'DBFEmealtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'typename',
			valueField : 'id',
			mode : 'local',
			readOnly:true,
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
						fields : [ 'id','typename' ],
						listeners : {
							load : function() {
									Ext.getCmp('DBFEmealtypeid')
										.setValue(Ext.getCmp('DBFEmealtypeid').getValue());
									foodtypestore.load({params:{"Q_diningMealtype.id_L_EQ":Ext.getCmp('DBFEmealtypeid').getValue(),
																"Q_category_S_EQ":"普通餐"}});
							}
						}							
					})		
		});
						
		
		
		this.topbar2 = new Ext.Toolbar( {
			items : [ {
				iconCls : 'btn-del',
				text : '删除',
				xtype : 'button',
				scope : this,
				handler : this.deleteRs
			} ]
		});
		
		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DBFEfoodtypeid')
									.setValue(Ext.getCmp('DBFEfoodtypeid').getValue());
						}
					}									
				});	
		//站点数据源
		var siteNamestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningPlace.do',
					fields : [ 'id','sitename' ]
				});	
		
				
		var userstore = new Ext.data.Store( {
			proxy : new Ext.data.HttpProxy({
				url : __ctxPath + '/system/selectAppUser.do?depId='+curUserInfo.depId
			}),
			autoLoad:false,
			reader:new Ext.data.JsonReader({
				root : 'result',
				totalProperty : 'totalCounts',
				fields : [ {
					name : 'userId',
					type : 'int'
				}, 'username','fullname']
			}),
			remoteSort : false
		});
		userstore.load();
		
		combomealtype.on('select',function(combobox){
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue(),
				'Q_category_S_EQ':'普通餐'}});
			combofoodtype.setValue('');
		});
		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类型',
			hiddenName : 'diningBooking.foodtypeid',
			id:'DBFEfoodtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'foodtypename',
			valueField : 'id',
			mode : 'local',
			store : foodtypestore
		});
		//站点名称下拉框
		var comboDingplace = new Ext.form.ComboBox({
			fieldLabel : '订餐站点',
			hiddenName : 'diningBooking.dineplace',
			id:'DBFEdineplace',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'sitename',
			valueField : 'id',
			mode : 'local',
			store : siteNamestore
		});
						
//		var diningUser = new Ext.form.ComboBox({
//			fieldLabel : '选择订餐人员',
//			hiddenName : 'diningUserNames',
//			id:'DBFEdiningUserids',
//			flex : 1,
//			width : 150,
//			xtype : 'combo',
//			editable : false,
//			allowBlank : false,
//			triggerAction : 'all',
//			displayField : 'fullname',
//			mode : 'local',
//			onTriggerClick:function() {
//				UserSelector.getView(function(ids, names) {
//					Ext.getCmp('DBFEdiningUserids').setValue(names);
//					Ext.getCmp('DBFEdiningHiddenUserids').setValue(ids);
//				},false,false//,Ext.getCmp('DBFEdiningHiddenUserids').getValue(),Ext.getCmp('DBFEdiningUserids').getValue()
//				).show();}
//		});
		
		var diningDetailstore = new Ext.data.Store(
				{
					proxy : new Ext.data.HttpProxy({
						url : __ctxPath + '/diningMgnt/listDiningBookingDetail.do?Q_diningBooking.id_L_EQ='+this.id
					}),
					autoLoad:true,
					reader:new Ext.data.JsonReader({
						root : 'result',
						totalProperty : 'totalCounts',
						fields : [ 'id','appUser.fullname','diningFoodtype.id','diningFoodtype.foodtypename','qty','diningFoodtype.price','amount','diningroom' ]
					}),	
					remoteSort : false
				});				
		
		this.diningBookingPanel = new HT.GridPanel({
			id : 'DBFEdiningpanel',			
			tbar:this.topbar2,
			rowActions:false,
			region : 'center',
			store : diningDetailstore,
			height : 150,
			anchor: '85% 30%',
			columns : [
					    {
							header : 'id',
							dataIndex : 'id',
							hidden : true
					    },
					    {
							header : '订餐人姓名',
							width : 50,
							dataIndex : 'appUser.fullname'
						
						},
						{
							header : 'id',
							width : 50,
							dataIndex : 'diningFoodtype.id',
							hidden:true
						},
					    {
							header : '供餐食堂',
							width : 50,
							dataIndex : 'diningroom'
						
						},
					    {
							header : '订餐种类',
							width : 50,
							dataIndex : 'diningFoodtype.foodtypename'
						
						},
					    {
							header : '数量',
							width : 50,
							dataIndex : 'qty'						
						},
					    {
							header : '价格',
							width : 50,
							dataIndex : 'diningFoodtype.price'						
						},
					    {
							header : '合计',
							width : 50,
							dataIndex : 'amount'						
						}
						
			]			
		});		
		//this.diningBookingPanel.addListener('rowdblclick', this.rowClick);
		
			
		this.formPanel = new Ext.FormPanel( {
			region : 'north',
			layout : 'form',
			height : 490,
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DiningBookingFormEdit',
			defaults : {
				anchor : '96%,96%'
			},
			reader : new Ext.data.JsonReader({
				root : 'data'
			}, [{
			            name:'diningBooking.menudate',
			            mapping:'menudate'
			        },{
						name : 'diningBooking.foodtypeid',
						mapping : 'foodtypeid'
					},{
						name : 'diningBooking.mealtypeid',
						mapping : 'mealtypeid'
					},{
						name : 'diningBooking.dineaddress',
						mapping : 'dineaddress'
					},{
						name : 'diningBooking.totalamount',
						mapping : 'totalamount'
					},{
						name : 'diningBooking.dineplace',
						mapping : 'dineplace'
					},{
						name : 'diningBooking.diningroom',
						mapping : 'diningroom'
					}]),
			defaultType : 'textfield',
			items : [ {
				name : 'diningBooking.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : 'userid',
				name : 'diningBooking.userid',
				allowBlank : false,
				xtype : 'hidden',
				value : curUserInfo.userId
			}, {
				fieldLabel : 'deptid',
				name : 'diningBooking.deptid',
				allowBlank : false,
				xtype : 'hidden',
				value : curUserInfo.depId
			}, {
				fieldLabel : '订餐日期',
				name : 'diningBooking.menudate',
				id:'DBFEmenudate',
				allowBlank : false,
				readOnly:true
			},{
				fieldLabel : '供餐食堂',
				hiddenName : 'diningBooking.diningroom',
				id:'DBFrmEditdiningroom',
				flex : 1,
				width : 150,
				xtype : 'combo',
				editable : false,
				allowBlank : false,
				triggerAction : 'all',
				displayField : 'configname',
				valueField : 'configname',
				mode : 'local',
				store : new Ext.data.SimpleStore(
						{
							autoLoad : true,
							url : __ctxPath + '/diningMgnt/getDiningRoomComboDiningBooking.do',
							fields : [ 'configname','configname' ],
							load : function() {
								Ext.getCmp('DBFrmEditdiningroom')
									.setValue(Ext.getCmp('DBFrmEditdiningroom').getValue());
							}							
						})
			},
			combomealtype,
			combofoodtype,
			comboDingplace,
			/*{
				fieldLabel : '订餐站点',
				name : 'diningBooking.dineplace',
				id:'DBFEdineplace',
				allowBlank : false,
				maxLength:20
			},*/	{
				fieldLabel : '具体地址',
				name : 'diningBooking.dineaddress',
				id:'DBFEdineaddress',
				allowBlank : true,
				maxLength:50
			},{
				fieldLabel : '选择订餐员工',
				name : 'diningUserNames',
				id:'DBFEdiningUserids',
				width : 150,
				readOnly  : true,
				allowBlank : true,
				listeners:{focus:function() {
					//alert("handler");
					UserSelectorExtend.getView(function(ids, names) {
						Ext.getCmp('DBFEdiningUserids').setValue(names);
						Ext.getCmp('DBFEdiningHiddenUserids').setValue(ids);
					},false,false,Ext.getCmp('DBFEdiningHiddenUserids').getValue(),Ext.getCmp('DBFEdiningUserids').getValue()
					).show();}}
			},	{
				fieldLabel : '总计金额',
				name : 'diningBooking.totalamount',
				allowBlank : false,
				xtype : 'numberfield',
				readOnly:true,
				value:0
			},	
			{
				fieldLabel : 'hidden订餐人员',
				name : 'diningUserIds',
				id:'DBFEdiningHiddenUserids',
				allowBlank : true,
				xtype : 'hidden'
			}//,diningUser
			,this.diningBookingPanel				
			]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			/*this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningBooking.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningBooking'
			});*/
			this.formPanel.getForm().load({
				url : __ctxPath + '/diningMgnt/getDiningBooking.do?id='
				+ this.id,					
				root : 'data',
				preName : 'diningBooking',
				waitMsg : '正在载入数据...',
				success : function(form, action) {}
			});
			dbid = this.id;
		}
		//alert(Ext.getCmp('foottypeidtemp').getValue());
		//Ext.getCmp('DBFEfoodtypeid').setValue(Ext.getCmp('foottypeidtemp').getValue());

	},// end of the initcomponents

	
	createRs:function() {
		$postDBEditSaveFrm( {
			formPanel : this.formPanel,
			ids: Ext.getCmp('DBFEdiningHiddenUserids').getValue(),	
			scope : this,
			idName: 'userId',
			url : __ctxPath + '/diningMgnt/addDetailDiningBooking.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningBookingGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});	
		
	},	

	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.loadData( {
			url : __ctxPath + '/diningMgnt/getDiningBooking.do?id='
					+ this.id,
			root : 'data',
			preName : 'diningBooking'
		});
		//this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * 
	 * @param {}
	 *            window
	 */
	cancel : function() {
		this.close();
	},
	
	deleteRs:function(){
		delDBdetailRs( {
			url : __ctxPath + '/diningMgnt/multiDelDetailDiningBooking.do',
			scope : this,
			grid : this.diningBookingPanel,
			formPanel: this.formPanel, 
			idName : 'id',
			callback:function(fp,action){
//				var gridPanel = Ext.getCmp('DiningBookingGrid');
//				if (gridPanel != null) {
//					gridPanel.getStore().reload();
//				}						
		}
		});

	},
	/**
	 * 保存记录
	 */
	save : function() {
		$postDBEditSaveFrm( {
			formPanel : this.formPanel,
			ids: Ext.getCmp('DBFEdiningHiddenUserids').getValue(),	
			scope : this,
			idName: 'userId',
			url : __ctxPath + '/diningMgnt/addDetailDiningBooking.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningBookingGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
		
	}// end of save

});