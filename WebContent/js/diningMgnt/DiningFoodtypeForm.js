/**
 * @author 
 * @createtime 
 * @class DiningFoodtypeForm
 * @extends Ext.Window
 * @description DiningFoodtype表单
 * @company 捷达世软件
 */
DiningFoodtypeForm = Ext.extend(Ext.Window, {
	//构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		//必须先初始化组件
		this.initUIComponents();
		DiningFoodtypeForm.superclass.constructor.call(this, {
			id : 'DiningFoodtypeFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '订餐类型详细信息',
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
	},//end of the constructor
	//初始化组件
	initUIComponents : function() {
		
		var comboType = new Ext.form.ComboBox( {
			fieldLabel : '分类',
			hiddenName : 'diningFoodtype.category',
			id : 'DiningFoodFCombotype',
			editable : false,
			triggerAction : 'all',
			store : ['普通餐','接待餐','工作餐' ],
			maxLength : 10,
			allowBlank : false,
			anchor : '30%',
			listeners : {
				load : function() {
						Ext.getCmp('DiningFoodFCombotype')
							.setValue(Ext.getCmp('DiningFoodFCombotype').getValue());
				}
			}
		});	
		var combomeal = new Ext.form.ComboBox({
			fieldLabel : '订餐类别',
			hiddenName : 'diningFoodtype.mealtypeid',
			allowBlank : false,
			id:'DiningFoodFmealtypeid',
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
								Ext.getCmp('DiningFoodFmealtypeid')
									.setValue(Ext.getCmp('DiningFoodFmealtypeid').getValue());
						}
					}								
					})
					
		});
		
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			//id : 'DiningFoodtypeForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [ {
				name : 'diningFoodtype.id',
				xtype : 'hidden',
				value : this.id == null ? '' : this.id
			}, {
				fieldLabel : '订餐类型名称',
				name : 'diningFoodtype.foodtypename',
				allowBlank : false,
				maxLength : 50
			},comboType,combomeal
			,
			{
				fieldLabel : '价格',
				name : 'diningFoodtype.price',
				allowBlank : false,
				xtype : 'numberfield'
			}]
		});
		//加载表单对应的数据	
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/diningMgnt/getDiningFoodtype.do?id='
						+ this.id,
				root : 'data',
				preName : 'diningFoodtype'
			});
		}

	},//end of the initcomponents

	/**
	 * 重置
	 * @param {} formPanel
	 */
	reset : function() {
		this.formPanel.getForm().reset();
	},
	/**
	 * 取消
	 * @param {} window
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
			url : __ctxPath + '/diningMgnt/saveDiningFoodtype.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('DiningFoodtypeGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}//end of save

});