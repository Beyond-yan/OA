RejectView  = Ext.extend(Ext.Window, {
	// 内嵌FormPanel
	formPanel : null,
	
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 必须先初始化组件
		this.initUIComponents();
		RejectView.superclass.constructor.call(this, {
			layout : 'fit',
			id : 'RejectViewWin',
			title : '退文信息',
			iconCls : 'menu-product',
			width : 400,
			height : 200,
			items:this.formPanel,
			maximizable : true,
			border : false,
			modal : true,
			plain : true,
			buttonAlign : 'center',
			buttons : this.buttons
		});
	},
	// 初始化组件
	initUIComponents : function() {
		//初始化form表单
		this.formPanel = new Ext.FormPanel({
			layout : 'form',
			id : 'RejectViewPanel',
			url : __ctxPath + '/archive/saveNormalArchivesAction.do',
			frame : false,
			border : false,
			labelWidth:70,
			width : 400,
			padding : '5px',
			items : [{
				layout : 'column',
				defaults : {
					border : false
				},
				fieldLabel : '退文原因',
				width : 280,
				xtype : 'combo',
				listWidth : 280,
				hiddenName : 'Q_ref1_S_EQ',
				editable : false,
				triggerAction : 'all',
				displayField : 'name',
				valueField : 'id',
				store : new Ext.data.SimpleStore({
					autoLoad : true,
					url : __ctxPath
							+ '/archive/comQuickOdCommonComments.do?Q_ref1_S_EQ=3',
					fields : ['id', 'name']
				})
			},{
				layout : 'column',
				defaults : {
					border : false
				},
				fieldLabel : '退文详情',
				width : 280,
				autoScroll:true,
				id:'RejectView.comments',
				xtype : 'textarea',
				maxLength:500,
				height:80
			}]	
		});
		this.buttons = [{
			text : '确定',
			iconCls : 'btn-save',
			scope : this,
			handler : this.save
		},{
			text : '取消',
			iconCls : 'btn-cancel',
			handler : function() {
				Ext.getCmp('RejectViewWin').close();
			}
		}];
	},	//end of the initUIComponents
	
	/**
	 * 保存记录
	 */
	save : function() {
		var comments=Ext.getCmp('RejectView.comments').getValue();
		if(comments==""){
			alert("请填写退文详情！");
			return false;
		}
		var taskId=this.taskId;
		var status=this.status;
		var signalName=this.signalName;
		var activityName=this.activityName;
		var destName=this.destName;
		var sendMail=this.sendMail;
		var sendMsg=this.sendMsg;
		var sendInfo=this.sendInfo;
		var flowAssignId=this.flowAssignId;
	    Ext.Msg.confirm('信息确认', '请确认是否需要退文。', function(btn) {
			if (btn == 'yes') {
				addMsgFunction(true,taskId);
				Ext.Ajax.request({
					url:__ctxPath+ "/flow/nextForSyncProcessActivity.do",
					method:'post',
					timeout:120000,
					//waitMsg:'正在提交处理，请稍等',
					scope:this,
					params:{
						'taskId':taskId,
						'status':status,
						'signalName':signalName,
						'activityName':activityName,
						'comments':comments,
						'destName':destName,
						'sendMail':sendMail,
						'sendMsg':sendMsg,
						'sendInfo':sendInfo,
						'flowAssignId':flowAssignId
					},
					success : function(fp, action) {
						// --无后续的错误友好提示开始
                        var jsonResult = JSON.parse(fp.responseText);
                        if (jsonResult) {
                            if (jsonResult && jsonResult.success == "true") {
                                Ext.ux.Toast.msg("操作信息", "操作成功！");
                            } else {
                                var resultMsg = "信息保存出错，请联系管理员！";
                                var resuIcon = Ext.MessageBox.ERROR;
                                if (jsonResult.message && jsonResult.message != null) {
                                    resultMsg = jsonResult.message;
                                    if (jsonResult.code && (jsonResult.code == '2' || jsonResult.code == '3')) {
                                        resuIcon= Ext.MessageBox.WARNING;
                                    }
                                }
                                Ext.MessageBox.show({
                                    title : '操作信息',
                                    msg : resultMsg,
                                    buttons : Ext.MessageBox.OK,
                                    icon : resuIcon
                                });
                            }
                        }
                        // --无后续的错误友好提示结束
						 AppUtil.removeTab('ProcessForm' + taskId);
						 refreshTaskPanelView();
						 Ext.getCmp('RejectViewWin').close();
				    },
					failure : function(fp, action) {
						Ext.MessageBox.show({
                            title : '操作信息',
                            msg : '当前系统繁忙，请稍后再处理！',
                            buttons : Ext.MessageBox.OK,
                            icon : Ext.MessageBox.WARNING
                        });
					}
				});
			}
		});
	}
});