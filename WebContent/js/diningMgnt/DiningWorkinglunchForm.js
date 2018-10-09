/**
 * @author
 * @createtime
 * @class DiningWorkinglunchForm
 * @extends Ext.Window
 * @description DiningWorkinglunch表单
 * @company 捷达世软件
 */
DiningWorkinglunchForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningWorkinglunchForm.superclass.constructor.call(this, {
			id : 'DiningWorkinglunchFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '工作餐申请详细信息',
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
		var combodept = new Ext.form.ComboBox({
			fieldLabel : '申请部门',
			hiddenName : 'diningWorkinglunch.department.depId',
			id : 'DiningWLdepartmentcombo',
			flex : 1,
			width : 200,
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'depname',
			valueField : 'depid',
			mode : 'local',
			store : new Ext.data.SimpleStore(
					{
						autoLoad : true,
						url : __ctxPath + '/system/comboDepartment.do',
						fields : [ 'depid',
								'depname' ],
						listeners : {
							load : function() {
								Ext.getCmp('DiningWLdepartmentcombo')
									.setValue(curUserInfo.depId);
							}
						}
					})
		});		
		
		var combomealtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类别',
			hiddenName : 'diningWorkinglunch.diningMealtype.id',
			id:'DiningWLmealtypeid',
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
									Ext.getCmp('DiningWLmealtypeid')
										.setValue(Ext.getCmp('DiningWLmealtypeid').getValue());
							}
						}							
					})		
		});

		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DiningWLfoodtypeid')
									.setValue(Ext.getCmp('DiningWLfoodtypeid').getValue());
						}
					}									
				});		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐级别',
			hiddenName : 'diningWorkinglunch.diningFoodtype.id',
			id:'DiningWLfoodtypeid',
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
		
		combomealtype.on('select',function(combobox){
						
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue(),
				'Q_category_S_EQ':'工作餐'}});
			combofoodtype.setValue('');
		});	
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DiningWorkinglunchForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningWorkinglunch.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, combodept, {
				fieldLabel : 'apply_userid',
				name : 'diningWorkinglunch.appUser.userId',
				allowBlank : false,
				xtype : 'hidden',
				value:curUserInfo.userId
			}, {
				fieldLabel : '用餐日期',
				name : 'diningWorkinglunch.dinedate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date(),
				editable:false
			},
			{
				fieldLabel : '供餐食堂',
				hiddenName : 'diningWorkinglunch.diningroom',
				id:'diningWorkinglunchdiningroom',
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
							listeners : {
							load : function() {
									Ext.getCmp('diningWorkinglunchdiningroom')
										.setValue(Ext.getCmp('diningWorkinglunchdiningroom').getValue());
								}
							}	
						})
			}, combomealtype, combofoodtype, {
				fieldLabel : '用餐次数',
				name : 'diningWorkinglunch.dinetimes',
				allowBlank : false,
				maxLength : 100
			}, {
				fieldLabel : '订工作餐事由',
				name : 'diningWorkinglunch.dinereason',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '用餐人数',
				name : 'diningWorkinglunch.dinenumber',
				allowBlank : false,
				xtype : 'numberfield'
			}, {
				fieldLabel : '用餐地点',
				name : 'diningWorkinglunch.dineplace',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '实际费用(/人/份)',
				name : 'diningWorkinglunch.costlevel',
				allowBlank : false,
				xtype : 'numberfield'
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningWorkinglunch.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningWorkinglunch'
			});
		}

	},// end of the initcomponents

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
	save : function() {
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/diningMgnt/saveDiningWorkinglunch.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningWorkinglunchGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});