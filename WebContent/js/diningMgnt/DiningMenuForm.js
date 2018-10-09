/**
 * @author
 * @createtime
 * @class DiningMenuForm
 * @extends Ext.Window
 * @description DiningMenu表单
 * @company 捷达世软件
 */
function $postFormSave(conf){
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
									msg : '信息保存出错，'+ action.result.exmsg ,
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

DiningMenuForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		DiningMenuForm.superclass.constructor.call(this, {
			id : 'DiningMenuFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '菜单管理详细信息',
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
		
		var foodtypestore = new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/diningMgnt/comboDiningFoodtype.do',
					fields : [ 'id','foodtypename' ],
					listeners : {
						load : function() {
								Ext.getCmp('DiningMenuFfoodtypeid')
									.setValue(Ext.getCmp('DiningMenuFfoodtypeid').getValue());
						}
					}									
				});		
		
		var combomealtype=new Ext.form.ComboBox({
			fieldLabel : '用餐类别',
			hiddenName : 'diningMenu.diningMealtype.id',
			allowBlank : false,
			id:'DiningMenuFmealtypeid',
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
								Ext.getCmp('DiningMenuFmealtypeid')
									.setValue(Ext.getCmp('DiningMenuFmealtypeid').getValue());
						}
					}								
					})
					
		});
	
		
		var combofoodtype = new Ext.form.ComboBox({
			fieldLabel : '用餐类型',
			hiddenName : 'diningMenu.diningFoodtype.id',
			id:'DiningMenuFfoodtypeid',
			flex : 1,
			width : 150,
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'foodtypename',
			valueField : 'id',
			mode : 'local',
			store : foodtypestore			
		});
		
		combomealtype.on("select",function(combobox){
			foodtypestore.load({params:{
				'Q_diningMealtype.id_L_EQ':combobox.getValue()
				}});
			combofoodtype.setValue('');
		});
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DiningMenuForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningMenu.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '用餐日期',
				name : 'diningMenu.menudate',
				allowBlank : false,
				xtype : 'datefield',
				format : 'Y-m-d',
				value : new Date()
			},
			{
				fieldLabel : '供餐食堂',
				hiddenName : 'diningMenu.diningroom',
				id:'DiningMenuFrmdiningroom',
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
									Ext.getCmp('DiningMenuFrmdiningroom')
										.setValue(Ext.getCmp('DiningMenuFrmdiningroom').getValue());
								}
							}	
						})
			},
			combomealtype , 
			{
				fieldLabel : '食品名称',
				name : 'diningMenu.foodname',
				allowBlank : false,
				maxLength : 50
			}
			, {
				fieldLabel : '单位',
				name : 'diningMenu.unitname',
				allowBlank : false,
				maxLength : 50
			}, {
				fieldLabel : '价格',
				name : 'diningMenu.price',
				allowBlank : false,
				xtype : 'numberfield'
			},{
				fieldLabel : 'createuserid',
				name : 'diningMenu.createuserid',
				allowBlank : false,
				xtype : 'hidden',
				value:curUserInfo.userId
			}, {
				fieldLabel : 'createdate',
				name : 'diningMenu.createdate',
				allowBlank : false,
				xtype : 'hidden',
				format : 'Y-m-d',
				value : new Date()
			}, {
				fieldLabel : 'lastedituserid',
				name : 'diningMenu.lastedituserid',
				allowBlank : false,
				xtype : 'hidden',
				value:curUserInfo.userId
			}, {
				fieldLabel : 'lasteditdate',
				name : 'diningMenu.lasteditdate',
				allowBlank : false,
				xtype : 'hidden',
				format : 'Y-m-d',
				value : new Date()
			} ]
		});
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningMenu.do?id=' + this.id,
				root : 'data',
				preName : 'diningMenu'
			});
			Ext.getCmp('DiningMenuFfoodtypeid')
			.setValue(Ext.getCmp('DiningMenuFfoodtypeid').getValue());
			Ext.getCmp('DiningMenuFmealtypeid')
			.setValue(Ext.getCmp('DiningMenuFmealtypeid').getValue());
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
		$postFormSave( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/diningMgnt/saveDiningMenu.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningMenuGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});