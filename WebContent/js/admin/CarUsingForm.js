/**
 * @author
 * @createtime
 * @class CarUsingForm
 * @extends Ext.Window
 * @description 用车记录表单
 * @company 捷达世软件
 */
CarUsingForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CarUsingForm.superclass.constructor.call(this, {
			id : 'CarUsingFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 400,
			width : 500,
			maximizable : true,
			title : '用车记录详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
			}, 
//			{
//				text : '重置',
//				iconCls : 'btn-reset',
//				scope : this,
//				handler : this.reset
//			},
			{
				text : '取消',
				iconCls : 'btn-cancel',
				scope : this,
				handler : this.cancel
			} ]
		});
	},// end of the constructor
	// 初始化组件
	initUIComponents : function() {
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'CarUsingForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			items : [
					{
						name : 'carUsing.id',
						xtype : 'hidden',
						value : this.id == null ? '' : this.id
					},
					{
						name : 'carUsing.applyId',
						id : 'applyId',
						xtype : 'hidden'

					},
					{
						name : 'carUsing.carId',
						id : 'carId',
						xtype : 'hidden'
					},
					{
						xtype : 'container',
						layout : 'column',
						style : 'padding-left:0px;margin-bottom:4px;',
						items : [
								{
									xtype : 'label',
									style : 'padding-left:0px;',
									text : '车牌号码:',
									width : 105
								},
								{
									xtype : 'textfield',
									name : 'carUsing.car.carno',
									id : 'carNo',
									editable : true,
									allowBlank : false,
									width : 150
								}, {
									xtype : 'button',
									text : '清除记录',
									iconCls : 'reset',
									handler : function() {
										Ext.getCmp('carNo').setValue('');
									}
								},{
									xtype : 'button',
									iconCls : 'btn-car',
									text : '选择申请单',
									handler : function() {
										var carNo = Ext.getCmp('carNo').getValue();
										if (carNo == '') {
											Ext.MessageBox.show( {
												title : '操作信息',
												msg : '请输入正确车牌！',
												buttons : Ext.MessageBox.OK,
												icon : 'ext-mb-error'
											});
											return;
										}
										CarApplySelector.getView(
												function(id, name, driver,
														applyId,driverId) {
													Ext.getCmp('carId')
															.setValue(id);
													Ext.getCmp('carNo')
															.setValue(name);
													Ext.getCmp('driver')
															.setValue(driver);
													Ext.getCmp('applyId')
															.setValue(applyId);
													Ext.getCmp('carUsingDriverId')
															.setValue(driverId);
												}, true,Ext.getCmp('carNo').getValue()).show();
									}
								} ]

					}, {
						fieldLabel : '司机',
						name : 'carUsing.driver',
						id : 'driver',
						readOnly : true,
						xtype : 'textfield'
					},{
						name : 'carUsing.driverId',
						id:'carUsingDriverId',
						xtype : 'hidden'
					},  
					{
						name : 'carUsing.oilCardId',
						xtype : 'hidden'
					}, {

						xtype : 'container',
						id : 'code',
						style : 'padding-left:0px;margin-bottom:4px;',
						layout : 'column',
						items : [ {
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '油卡号:',
							width : 105
						}, {
							xtype : 'textfield',
							id:'oilCardCode',
							name : 'carUsing.carOilCard.code',
							editable : false,
							readOnly : true,
							allowBlank : false,
							width : 300
						} ]

					}, {
						name : 'carUsing.payCardId',
						xtype : 'hidden'
					}, {

						xtype : 'container',
						id : 'passCode',
						style : 'padding-left:0px;margin-bottom:4px;',
						layout : 'column',
						items : [ {
							xtype : 'label',
							style : 'padding-left:0px;',
							text : '粤通卡号:',
							width : 105
						}, {
							xtype : 'textfield',
							id:'passFeeCardCode',
							name : 'carUsing.carPassFeeCard.code',
							editable : false,
							readOnly : true,
							allowBlank : false,
							width : 300
						} ]
					}, {
						fieldLabel : '出车时间',
						name : 'carUsing.leavingDt',
						id:'carUsing.leavingDt',
						allowBlank : false,
						xtype : 'datetimefield',
						format : 'Y-m-d H:i:s'
					}, {
						fieldLabel : '收车时间',
						name : 'carUsing.comingDt',
						id:'carUsing.comingDt',
						allowBlank : false,
						xtype : 'datetimefield',
						format : 'Y-m-d H:i:s'
					}, {
						fieldLabel : '行驶里程数(公里)',
						name : 'carUsing.distance',
						allowBlank : false,
						maxLength : 18
					}, {
						fieldLabel : '过路费',
						name : 'carUsing.passFee',
						value:'0',
						maxLength : 18
					}, {
						fieldLabel : '停车费',
						name : 'carUsing.parkFee',
						value:'0',
						maxLength : 18
					}, {
						fieldLabel : '其它费用',
						name : 'carUsing.otherFee',
						value:'0',
						maxLength : 18
					}, {
						fieldLabel : '备注',
						name : 'carUsing.des',
						xtype : 'textarea'
					} ]
		});

		if (this.id == null) {
			Ext.getCmp('code').hide();
			Ext.getCmp('passCode').hide();
			Ext.getCmp('passFeeCardCode').allowBlank=true;
			Ext.getCmp('oilCardCode').allowBlank=true;
		}
		// 加载表单对应的数据
		if (this.id != null && this.id != 'undefined') {
			this.formPanel.loadData( {
				url : __ctxPath + '/admin/getCarUsing.do?id=' + this.id,
				root : 'data',
				preName : 'carUsing'
			// success : function(form, action){
					// var carno=action.result.data.car.carno;
					// alert(carno);
					// Ext.getCmp('carNo').setValue(carno);

					// }
					});
			// alert(this.car.carno);
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
		var applyId=Ext.getCmp('applyId').getValue();
		if(applyId==''||applyId==undefined||applyId==null){
			Ext.Msg.alert("提示", "请选择申请单！");
			return;
		}
		var startTime = Ext.util.Format.date(Ext.getCmp("carUsing.leavingDt").getValue(),'Y-m-d H:i:s');
		var endTime=Ext.util.Format.date(Ext.getCmp("carUsing.comingDt").getValue(),'Y-m-d H:i:s');
		var d1 = startTime.replace(/\-/g,'\/');
		var stratDate =new Date(d1);
		var d2 = endTime.replace(/\-/g,'\/');
		var endDate =new Date(d2);
		if(stratDate>=endDate){
			Ext.Msg.alert("注意", "出车时间应小于收车时间！");
			return;
		}
		$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/admin/saveCarUsing.do',
			callback : function(fp, action) {
				var gridPanel = Ext.getCmp('CarUsingGrid');
				if (gridPanel != null) {
					gridPanel.getStore().reload();
				}
				this.close();
			}
		});
	}// end of save

});