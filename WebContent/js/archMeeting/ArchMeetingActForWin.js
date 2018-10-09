/**
 * @author:LiuSicen
 * @class ArchMeetingActForWin
 * @extends Ext.Panel
 * @description 会议通知代处理
 */
ArchMeetingActForWin = Ext.extend(Ext.Window, {
			// 构造函数
			constructor : function(_cfg) {
				Ext.applyIf(this, _cfg);
				// 初始化组件
				this.initUIComponents();
				// 调用父类构造
				ArchMeetingActForWin.superclass.constructor.call(this, {
							id : 'ArchMeetingActForWin',
							iconCls : 'btn-edit',
							title : '代处理',
							layout : 'form',
							labelWidth : 20,
							modal : true,
							height : 200,
							border :false,
							width : 430,
							bottons : this.bottons,
							buttonAlign : 'center',
							items : [{
								   layout:'column',
								   style:'padding:6px 0px 0px 0px',
								   border:false,
								   items:[this.radiogroup]
								},{
							   layout:'column',
							   style:'padding:6px 0px 0px 0px',
							   border:false,
							   items:[{
							   		layout:'form',
							   		border:false,
							   		items:[{	
						   					fieldLabel : '批示意见',
						   					id:'HYTZLDPSFormView.leaderOpinion',
											name : 'leaderOpinion',
											autoScroll:true,
											maxLength:500,
											height:80,
											xtype:'textarea',
											width:200,
											}]
							     	 },{
								   		layout:'form',
								   		style:'padding-top:10px;padding-left:5px;',
								   		border:false,
								   		items:[{
												xtype : 'button',
												text : '常用批示语',
												iconCls : 'menu-new-document',
												handler : function() {
													OdCommentsSelector.getView(
														function(id, name) {
															Ext.getCmp('HYTZLDPSFormView.leaderOpinion')
															.setValue(name);
															}, true).show();
													}
												}]
							  		}]
							}]
					});
			},// end of constructor

			// 初始化组件
			initUIComponents : function() {
				if(this.meetingState == "会议取消"){
					 this.radiogroup = new Ext.form.RadioGroup({
						 		  id : 'radiogroup', 
				                  fieldLabel: '处理结果',
				                  width: 200,
				                  items : [{
										boxLabel : '收到',
										name : 'option',
										inputValue : 0,
										checked : true
									}]
				              });
				}else{
					this.radiogroup = new Ext.form.RadioGroup({
						  id : 'radiogroup', 
		                  fieldLabel: '处理结果',
		                  width: 200,
		                  items : [{
								boxLabel : '参加',
								name : 'option',
								inputValue : 1,
								checked : true
							}, {
								boxLabel : '不参加',
								name : 'option',
								inputValue : 2
							}]
		              });
				}
				
				
				this.buttons = [{
					xtype:'button',
					text:'确认',
					iconCls:'btn-transition',
					scope:this,
					handler:function(){
						this.freeJump.call(this);
					}
				},{
					iconCls : 'btn-del',
					text  : '关闭',
					xtype : 'button',
					handler : this.colseWIn.createCallback(this),
					scope : this
				}];
			},// end of the initComponents()
			
			/**
			 * 自由跳转提交
			 */
			freeJump:function(){
				var type = Ext.getCmp('radiogroup').getValue().inputValue;
				var comments = Ext.getCmp('HYTZLDPSFormView.leaderOpinion').getValue() + "   [" + curUserInfo.fullname + "-代处理]";
				if(type == '1'){
					comments = "参加:" + comments;
				}else if(type == "2"){
					comments = "不参加:" + comments;
				}else if(type == "0"){
					comments = "收到:" + comments;
				}
				var noticeId = this.noticeId;
				var assignee = this.assignee;
				var assigneeName = this.assigneeName;
				var params={
					taskId : this.taskId,
					signalName : 'to 拟办分发',
					activityName : '领导批示',
					isForkFlow:true,
					isJoinFlow:true,
					joinName:'处内办理合并',
					prevName : '拟办分发',
					comments: comments,
					assignee:assignee,
					assigneeName:assigneeName
				};
				addMsgFunction(true,this.taskId);
				Ext.Ajax.request({
					method : 'POST',
					url : __ctxPath + "/flow/nextForLeaderByMeetingProcessActivity.do",
					waitMsg : '正在提交数据...',
					params : params,
					success : function(response) {
						Ext.MessageBox.hide();	
						var jsonResult = Ext.util.JSON.decode(response.responseText);
						console.log(jsonResult)
						if (jsonResult && jsonResult.success == "true") {
							Ext.ux.Toast.msg("操作信息", "审核成功！");
							console.log(noticeId)
							console.log(assignee)
							var activeParams = {
								noticeId: noticeId,
								leader: assignee
							};
							if(type == "1"){
								Ext.apply(activeParams,{
									state : '1'
								});
							}else{
								Ext.apply(activeParams,{
									state : '0'
								});
							}
							//同步领导日程
							Ext.Ajax.request({
								url : __ctxPath + '/leaderActivities/syncMeetingToActiveSchedule.do',
								method : 'POST',
								params : activeParams,
								success : function(response) {
								}
							});
							Ext.getCmp('ArchMeetingActForWin').close();
						}else {
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
						AppUtil.removeTab('ProcessForm' + this.taskId);
						refreshTaskPanelView();
						if(Ext.getCmp('ArchMeetingGrid')){
							Ext.getCmp('ArchMeetingGrid').getStore().reload();
						}
					},
					failure : function(fp, action) {
						Ext.MessageBox.hide();
						Ext.MessageBox.show({
							title : '操作信息',
							msg : '当前系统繁忙，请稍后再处理！',
							buttons : Ext.MessageBox.OK,
							icon : Ext.MessageBox.WARNING
						});
					} 
				}); 
			},
			/**
			 * 关闭窗口
			 */
			colseWIn : function(win){
				win.close();
			}
		});
