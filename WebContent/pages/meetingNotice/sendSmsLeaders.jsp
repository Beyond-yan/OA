<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<div class="contentDiv">
<div id="smsDiv">
</div>
<script type="text/javascript">
	var store = new Ext.data.JsonStore({
		data : Ext.decode('${appUsers}'),
		fields : ['userId','fullname']
	});
	// 初始化ColumnModel
	var sm = new Ext.grid.CheckboxSelectionModel();
	var cm = new Ext.grid.ColumnModel({
		columns : [sm, new Ext.grid.RowNumberer(), {
			header : 'userId',
			dataIndex : 'userId',
			hidden : true
		},{
			header : '领导',
			dataIndex : 'fullname'
		}],
		defaults : {
			sortable : true,
			menuDisabled : false,
			width : 100
		}
	});
	var gridPanel = new Ext.grid.GridPanel({
		id : 'ArchivesWriteOpionGrid',
		region : 'center',
		stripeRows : true,
		store : this.store,
		trackMouseOver : true,
		autoHeight : true,
		cm : cm,
		sm : sm,
		viewConfig : {
			forceFit : true,
			autoFill : true, // 自动填充
			forceFit : true
			// showPreview : false
		},
	});

	var frm = new Ext.Panel({
	    height: 350,
	    renderTo: 'smsDiv',
	    items: [{
			xtype : 'container',
			id:'HYTZNBFFFormView.depNeiqin',
			layout : 'hbox',
			style:'padding:6px 0px 6px 0px',
			items : [{
				xtype : 'label',
				text : '短信内容:',
				hideParent:true,
				style : 'padding-top:4px;',
				width : 80
			},{
		        xtype: "textarea",
		        fieldLabel: "短信内容",
		        id: "smsContent",
		        width : 270,
		        labelSepartor: "："
		    }]
		},gridPanel],
	    buttons: [{
	        text: "确定",
	        handler:completeTask
	    }]
	});
		
	var meetingNotice = Ext.decode('${meetingNotice}');
	function completeTask(taskId,assignee, assigneeName,type){
		var smsContent = Ext.getCmp('smsContent').getValue();
		var selectRecords = gridPanel.getSelectionModel().getSelections();
		if(smsContent == null || smsContent == ''){
			alert('请输入短信内容！');
			return;
		}
		if(selectRecords.length == 0){
			alert('请选择发送短信的领导！');
			return;
		}
		
		var leaders = new Array();
		for(var i = 0; i < selectRecords.length; i++){
			leaders.push(selectRecords[i].data.userId);
		}
		Ext.MessageBox.show({  
            msg : '正在发送，请稍后...',  
            width : 300,  
            wait : true,  
            progress : true,  
            closable : true,  
            waitConfig : {  
                interval : 200  
            },  
            icon : Ext.Msg.INFO  
        });
		Ext.Ajax.request({
			url : __ctxPath + '/meetingNotice/sendSmsForLeaderMeetingNotice.do',
			method : 'POST',
			params : {noticeId: meetingNotice.noticeId,leaders:leaders.join(','), smsContent:smsContent},
			success : function(response) {
				Ext.MessageBox.hide();
				Ext.MessageBox.show({
					title : '操作信息',
					msg : "发送成功",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.INFO
				});	
				Ext.getCmp('leaderSmsSendForm').close();
			},
			error : function(){
				Ext.MessageBox.hide();
				Ext.MessageBox.show({
					title : '操作信息',
					msg : "发送失败",
					buttons : Ext.MessageBox.OK,
					icon : Ext.MessageBox.ERROR
					});
			}
		});
	}
</script>