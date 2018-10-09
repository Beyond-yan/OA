/**
 * @author
 * @createtime
 * @class CapacityUpdateForm
 * @extends Ext.Window
 * @description Diary表单
 * @company 捷达世软件
 */
CapacityUpdateForm = Ext.extend(Ext.Window, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		CapacityUpdateForm.superclass.constructor.call(this, {
			id : 'CapacityUpdateFormWin',
			layout : 'fit',
			items : this.formPanel,
			modal : true,
			height : 160,
			width : 300,
			maximizable : true,
			title : '个人空间大小详细信息',
			buttonAlign : 'center',
			buttons : [ {
				text : '保存',
				iconCls : 'btn-save',
				scope : this,
				handler : this.save
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
		this.formPanel = new Ext.FormPanel( {
			layout : 'form',
			bodyStyle : 'padding:10px',
			border : false,
			autoScroll : true,
			// id : 'DiaryForm',
			defaults : {
				anchor : '96%,96%'
			},
			defaultType : 'textfield',
			reader : new Ext.data.JsonReader( {
				root : 'data'
			},[ {
				name : 'appUser.capacity',
				mapping : 'capacity'
			},{
				name : 'appUser.userId',
				mapping : 'userId'
			}
			]),
			items : [ {
				name : 'appUser.userId',
				xtype : 'hidden',
				value : this.userId == null ? '' : this.userId
			}, {
				fieldLabel : '现有空间容量(M)',
				name : 'appUser.capacity',
				maxLength : 50,
				style : 'background:#DCDCDC;',
				readOnly : true
			}, {
				fieldLabel : '新空间容量(M)',
				name : 'size',
				id : 'size',
				maxLength : 50
			}]
		});
		// 加载表单对应的数据
		if (this.userId != null && this.userId != 'undefined') {
			this.formPanel
					.load( {
						url : __ctxPath + '/system/getAppUser.do?userId='
						+ this.userId
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
		var size = Ext.getCmp('size').getValue();
		if(this.formPanel.getForm().isValid()){
			this.formPanel.getForm().submit({
					scope:this,
					url : __ctxPath + '/system/resetCapacityAppUser.do?size='+size+'&userId='+this.userId,
					method : 'post',
					waitMsg : '正在提交数据...',
					success : function(fp, action) {
						var result = Ext.util.JSON.decode(action.response.responseText);
						if(result.msg=='error'){
							Ext.ux.Toast.msg('错误提示','修改后的空间大小不能小于已用空间大小！');
						}else{
							this.close();
						}
						
					}
				});
		}
	/*	$postForm( {
			formPanel : this.formPanel,
			scope : this,
			url : __ctxPath + '/system/resetCapacityAppUser.do?size='+size+'&userId='+this.userId,
			callback : function(fp, action) {
			var result = Ext.util.JSON.decode(action.response.responseText);
			alert(result);
				if(result.msg=='error'){
					Ext.ux.Toast.msg('错误提示','修改后的空间大小不能小于已用空间大小！');
				}else{
					this.close();
				}
			}
		});*/
	}// end of save

});