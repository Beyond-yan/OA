var OutMeetingEditWin = function(meetingId,callback){
	var leadersId_new = '';
	var leaders_old = '';
	var win = new Ext.Window({
		height:200,
		width:700,
		padding:20,
		modal :true,
		title:'通知参会人员',
		items:[{
			xtype : 'container',
			layout : 'column',
			style : 'padding:0 0 5px;',
			defaults : {
				border : false
			},
			items : [{
						xtype : 'label',
						text : '通知人员:',
						width : 105
					},{
						id : 'MeetingRecordDep.attendLeaders',
						allowBlank:false,
						xtype : 'textfield',
						width : 445,
						readOnly : true
					},{
						xtype : 'button',
						width : 80,
						iconCls : 'menu-department',
						text : '人员选择',
						handler : function() {
							var url = __ctxPath + '/system/depLeadersTreeDepartment.do?depIds='+ curUserInfo.depId;
							DepLeaders.getView(
								function(userIds, userNames) {
									Ext.getCmp('MeetingRecordDep.attendLeaders').setValue(userNames);
									leadersId_new = userIds;
								}, false, null,url).show();
						}
					}]
			},{
				xtype : 'container',
				style : 'padding:0 0 5px;',
				layout : 'column',
				defaults : {
					border : false
				},
				items : [{
							xtype : 'label',
							text : '短信内容',
							width : 105
						}, {
							id:'msg_content',
							allowBlank:false,
							xtype : 'textarea',
							maxLength :500,
							width : 440,
							height: 60
						}]
			}],
			listeners:{
				render:function(){
					Ext.Ajax.request({
						url : __ctxPath + '/meeting/getOutMeeting.do?id='+meetingId,
						method:'post',
						success : function(response, options) {
							var r = Ext.util.JSON.decode(response.responseText).data;
							leaders_old = r.attendOfficeLeaders?r.attendOfficeLeaders:'';
							var hold_location=r.holdLocation?r.holdLocation:'';
							//(holdDate.format('Y年m月d日 H时i分'))
							//var holdDate=r.holdTime;
							var msg_content = r.holdTime+"，在"+hold_location+"，由"+r.holdDep+",召开关于"+r.name+"，请示。办公室。";
							Ext.getCmp('msg_content').setValue(msg_content);
						}
					});
				}
			},
			buttonAlign : 'center',
			buttons:[{
				text:'发送',
				iconCls:'btn-save',
				handler:function(){
					var al = Ext.getCmp('MeetingRecordDep.attendLeaders');
					if(!al.isValid())return;
					
					if(leaders_old){
						var oldLeadersOnly = leaders_old.replace(/\([^\;]+\)/g,'');
						
						var repeatUsers = '';
						var ls = al.getValue().split(',');
						var ids = leadersId_new.split(',');
						leadersId_new = '';
						var leaders = new Array();
						for(var i=0;i<ls.length;i++){
							if(oldLeadersOnly.indexOf(ls[i])==-1){
								leadersId_new += (leadersId_new.length>0?','+ids[i]:ids[i]);
								leaders.push(ls[i]);
							}else{
								repeatUsers += (ls[i]+',');
							}
						}
						if(repeatUsers){
							Ext.Msg.alert('提示',"已经通知过"+repeatUsers+"，将不再通知！");
						}
						
						var leaders_olds = leaders_old.split(';');
						var tailStr = '(已由'+curUserInfo.fullname+'通知)';
						var curStr = '';
						var index = 0;
						for(var v=0;v<leaders_olds.length;v++){
							index = leaders_olds[v].indexOf(tailStr);
							if(index!=-1){
								index = leaders_old.indexOf(leaders_olds[v]);
								curStr = leaders_old.substring(index,index+leaders_olds[v].length);
								break;
							}
						}
						
						
						var curStr_new = curStr;
						for(var ln=0;ln<leaders.length;ln++){
							if(curStr_new.indexOf(leaders[ln])==-1){
								curStr_new = leaders[ln]+','+curStr_new;
							}
						}
						if(curStr.length > 0){//merge 
							leaders_old = leaders_old.replace(curStr,curStr_new);
						}else{//has not cur created
							leaders_old += ';'+curStr_new+'(已由'+curUserInfo.fullname+'通知)';
						}
					}else{
						leaders_old = al.getValue()+'(已由'+curUserInfo.fullname+'通知)';
					}
					
					
					Ext.Ajax.request({
						url : __ctxPath + '/communicate/saveSmsMobile.do',
						method:'post',
						params:{
							'recipientIds':leadersId_new,
							'smsMobile.smsContent':Ext.getCmp('msg_content').getValue()
						},
						success : function(response, options) {
							
							var r = Ext.util.JSON.decode(response.responseText);
							if(r.msg){
								Ext.ux.Toast.msg('操作信息',msg);
							}else{
								Ext.Ajax.request({
									url : __ctxPath + '/meeting/saveOutMeeting.do',
									params : {
										'outMeeting.meetingId' : meetingId,
										'outMeeting.attendOfficeLeaders' : leaders_old
									},
									method:'post',
									success : function(response, options) {
										Ext.ux.Toast.msg('操作信息', '成功保存！');
										
										win.close();
										
										if(callback)callback();
									},
									failure : function(fp, action) {
										Ext.ux.Toast.msg('操作信息', '操作出错，请联系管理员！');
									}
								});
							}
						}
					});
					
				}
			},{
				text:'取消',
				iconCls:'btn-cancel',
				handler:function(){
					win.close();
				}
			}]
	 }).show();

}