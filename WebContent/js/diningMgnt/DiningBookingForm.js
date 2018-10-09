/**
 * @author
 * @createtime
 * @class DiningBookingForm
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
		
	function $postDBSaveForm(conf){	
		if(conf.formPanel.getForm().isValid()){
			
			var ids=conf.ids;
			//conf.params.ids = ids;
			conf.formPanel.getForm().submit({
					scope:conf.scope?conf.scope:this,
					params:conf.params,
					url : conf.url+'&ids='+ids,
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

DiningBookingForm = Ext.extend(Ext.Window, {
	// 构造函数
	//containerScroll:true,
	
	//autoScroll:true,
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningBookingForm.superclass.constructor.call(this, {
			id : 'DiningBookingFormWin',
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
				handler : this.savers
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
			id:'DBFmealtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : false,
			triggerAction : 'all',
			displayField : 'typename',
			valueField : 'id',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/diningMgnt/comboDiningMealtype.do',
						fields : [ 'id','typename' ],
						listeners : {
							load : function() {
									Ext.getCmp('DBFmealtypeid')
										.setValue(Ext.getCmp('DBFmealtypeid').getValue());
							}
						}							
					})		
		});
				 
		
		this.topbar = new Ext.Toolbar( {
			items : [{text : '员工姓名:'}
	         ,{						
	        	 	id:'DBFrmUserFullname',
					xtype : 'textfield',
					name : 'Q_fullname_S_LK'
				}, {
					xtype : 'button',
					text : '查询',
					iconCls : 'search',
					handler : this.filteruser
				}]
		});
		
		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DBFfoodtypeid')
									.setValue(Ext.getCmp('DBFfoodtypeid').getValue());
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
//		var userstore = new Ext.data.JsonStore( {
//			url : __ctxPath + '/system/getbydeptAppUser.do?Q_department.depId_L_EQ='+curUserInfo.depId,
//			method : 'post',
//			root : 'result',
//			totalProperty : 'totalCounts',
//			remoteSort : true,
//			autoLoad : true,					
//			fields : [ {
//				name : 'userId',
//				type : 'int'
//			}, 'userName'],
//			sortInfo : {
//				field : 'userName',
//				direction : 'ASC'
//			}
//		});		
		
		combomealtype.on('select',function(combobox){
			Ext.getCmp('hiddenmealtypeid').setValue(combobox.getValue());			
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue(),
				'Q_category_S_EQ':'普通餐'}});
			combofoodtype.setValue('');
		});
		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类型',
			hiddenName : 'diningBooking.foodtypeid',
			id:'DBFfoodtypeid',
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
			fieldLabel : '用餐站点',
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
//		combofoodtype.on('select',function(combobox){			
//			userstore.load({params:{
//				'foodtypeid':combobox.getValue(),
//				'deptid':curUserInfo.depId
//			}});
//		});
		
//		var store = new Ext.data.JsonStore( {
//			url : __ctxPath + "/diningMgnt/getcommonDiningMenu.do",
//			method : 'post',
//			root : 'result',
//			totalProperty : 'totalCounts',
//			remoteSort : true,
//			autoLoad : false,					
//			fields : [ {
//				name : 'id',
//				type : 'int'
//			}, 'menudate', 'diningMealtype.typename', 'foodname', 'diningFoodtype.foodtypename', 'price',
//					'createuserid', 'createdate', 'lastedituserid',
//					'lasteditdate','unitname' ],
//			sortInfo : {
//				field : 'menudate',
//				direction : 'DESC'
//			}
//		});		
//		
//		this.menugridPanel = new HT.GridPanel( {
//			region : 'north',
//			id : 'DiningMenuGrid',
//			store:store,
//			columns : [ {
//				header : 'id',
//				dataIndex : 'id',
//				hidden : true
//			}, {
//				header : '日期',
//				dataIndex : 'menudate'
//			}, {
//				header : '餐别',
//				dataIndex : 'diningMealtype.typename'
//			}, {
//				header : '名称',
//				dataIndex : 'foodname'
//			}, {
//				header : '类别',
//				dataIndex : 'diningFoodtype.foodtypename'
//			}, {
//				header : '价格',
//				dataIndex : 'price'
//			},
//			{
//				header : '单位',
//				dataIndex : 'unitname'
//			}]
//		// end of columns
//		});	
								
			
		this.formPanel = new Ext.FormPanel( {
			region : 'north',
			layout : 'form',
			height : 490,
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DBForm',
			defaults : {
				anchor : '96%,96%'
			},
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
				fieldLabel : '用餐日期',
				name : 'diningBooking.menudate',
				id:'DBFmenudate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date().setDate(new Date().getDate()+1),
				editable:false
			},{
				fieldLabel : '供餐食堂',
				hiddenName : 'diningBooking.diningroom',
				id:'DiningBookingFrmdiningroom',
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
							fields : [ 'configname','configname' ]
						})
			},{
				fieldLabel : 'hidden订餐日期',
				name : 'Q_menudate_D_EQ',
				id:'DBFhiddenmenudate',
				allowBlank : true,
				xtype : 'hidden'
			},
			combomealtype,
			combofoodtype,
			comboDingplace,
			/*{
				fieldLabel : '订餐站点',
				name : 'diningBooking.dineplace',
				id:'dineplace',
				allowBlank : false,
				maxLength:20
			},*/	{
				fieldLabel : '具体地址',
				name : 'diningBooking.dineaddress',
				id:'dineaddress',
				allowBlank : true,
				maxLength:50
			},{
				fieldLabel : '选择订餐员工',
				name : 'diningUserNames',
				id:'DBFdiningUserids',
				width : 150,
				readOnly  : true,
				allowBlank : false,
				listeners:{focus:function() {
					//alert("handler");
					UserSelectorExtend.getView(function(ids, names) {
						Ext.getCmp('DBFdiningUserids').setValue(names);
						Ext.getCmp('DBFdiningHiddenUserids').setValue(ids);
					},false,false,Ext.getCmp('DBFdiningHiddenUserids').getValue(),Ext.getCmp('DBFdiningUserids').getValue()
					).show();}}
			},		
			{
				fieldLabel : 'hidden订餐人员',
				name : 'diningUserIds',
				id:'DBFdiningHiddenUserids',
				allowBlank : true,
				xtype : 'hidden'
			},
			{
				fieldLabel : 'hidden餐别',
				name : 'Q_diningMealtype.id_L_EQ',
				id:'hiddenmealtypeid',
				allowBlank : true,
				xtype : 'hidden'
			},{
				fieldLabel : '总计金额',
				name : 'diningBooking.totalamount',
				allowBlank : false,
				xtype : 'hidden',
				readOnly:true,
				value:0
			}
			]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningBooking.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningBooking'
			});
		}
		var cDate = new Date();
		cDate.setDate(cDate.getDate()+1);
		var y = cDate.getFullYear();
		var m = cDate.getMonth()+1;//获取当前月份的日期
		var d = cDate.getDate();
		  
		var tomorrowDate = y+"-"+m+"-"+d;
		var d2 = tomorrowDate.replace(/\-/g,'\/');
		var endDate =new Date(d2);
		Ext.getCmp('DBFmenudate').setValue(endDate);
		
	},// end of the initcomponents
		
	/*
	 * 过滤员工
	 * 
	 */
	filteruser:function() {
		var username = Ext.getCmp('DBFrmUserFullname').getValue();
		var searchPanel = Ext.getCmp('DiningUserSearchForm');
	},
	
	/**
	 * 重置
	 * 
	 * @param {}
	 *            formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
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
	/**
	 * 保存记录
	 */
	savers : function() {
		var menuDate = Ext.util.Format.date(Ext.getCmp('DBFmenudate').getValue(),'Y-m-d');
		
		var currentDate = Ext.util.Format.date(new Date(),'Y-m-d');;
		if(menuDate<=currentDate && curUserInfo.isRestAdmin!=true){
			Ext.MessageBox.show({
				title : '警告',
				msg : '用餐日期应大于当天日期！',
				buttons : Ext.MessageBox.OK,
				icon : 'ext-mb-warning'
			});
			return;
		}

		$postDBSaveForm( {
			formPanel : this.formPanel,
			ids: Ext.getCmp('DBFdiningHiddenUserids').getValue(),			
			scope : this,
			url : __ctxPath + '/diningMgnt/saveDiningBooking.do?foodtypeid='+Ext.getCmp("DBFfoodtypeid").getValue(),
			callback : function(fp, action) {
				var menugridPanel = Ext.getCmp('DiningBookingGrid');
				if (menugridPanel != null) {
					menugridPanel.getStore().reload();
				}
				this.close();
			}
		});
		
	}
});