/**
 * @author:
 * @class ProcessTPReportView
 * @extends Ext.Panel
 * @description [ProcessReport]管理
 * @company 深圳捷达世软件有限公司
 * @createtime:
 */
     
/**      
* 对Date的扩展，将 Date 转化为指定格式的String      
* 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q) 可以用 1-2 个占位符      
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)      
* eg:      
* (new Date()).pattern("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423      
* (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
* (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
* (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
* (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
*/        
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "\u65e5",         
    "1" : "\u4e00",         
    "2" : "\u4e8c",         
    "3" : "\u4e09",         
    "4" : "\u56db",         
    "5" : "\u4e94",         
    "6" : "\u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "\u661f\u671f" : "\u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}       

function reduceByTransDate(dateParameter, num) {   
	  
    var translateDate = "", dateString = "", monthString = "", dayString = "";   
    translateDate = dateParameter.replace("-", "/").replace("-", "/");;   
  
    var newDate = new Date(translateDate);   
    newDate = newDate.valueOf();   
    newDate = newDate - num * 24 * 60 * 60 * 1000;   
    newDate = new Date(newDate);   
  
    //如果月份长度少于2，则前加 0 补位   
    if ((newDate.getMonth() + 1).toString().length == 1) {   
  
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();   
    } else {     
        monthString = (newDate.getMonth() + 1).toString();            
    }   
  
    //如果天数长度少于2，则前加 0 补位   
    if (newDate.getDate().toString().length == 1) {   
  
        dayString = 0 + "" + newDate.getDate().toString();   
    } else {   
  
        dayString = newDate.getDate().toString();   
    }   
  
    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;   
    return dateString;   
} 


//var date = new Date();      
//window.alert(date.pattern("yyyy-MM-dd hh:mm:ss"));   
 

ProcessTPReportView = Ext.extend(Ext.Panel, {
	// 构造函数
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		ProcessTPReportView.superclass.constructor.call(this, {
			id : 'ProcessTPReportView',
			title : '我参与的流程',
			iconCls :'menu-flowPr',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel ]
		});
	},// end of constructor
	// 初始化组件
	initUIComponents : function() {
		
		var ProRunMap = new Map();
		//文件会签
		ProRunMap.put(FlowDefIdPro.FileHuiQianId,'/report/archivesFileHuiQianReport.do');
		
		//经营班子会及材料审批
		ProRunMap.put(FlowDefIdPro.JingYingBanZiHuiId,'/report/archivesJingYingBanZiHuiReport.do');
		
		//内部工作联系单
		ProRunMap.put(FlowDefIdPro.InnerWorkConnId,'/report/archivesInnerWorkConnReport.do');
		
		//内部工作联系单收文
		ProRunMap.put(FlowDefIdPro.InnerWorkConnReceiveId,'/report/archivesInnerWorkReceiveConnReport.do');
		//文本评审
		ProRunMap.put(FlowDefIdPro.FilePingShenId,'/report/archivesDocumentReviewReport.do');
		
		
		//运营公司外收文
		ProRunMap.put(FlowDefIdPro.ArchivesReceiveOutsideId,'/report/archivesReceiveOutsideReport.do');
		
		//红头文件
		ProRunMap.put(FlowDefIdPro.RedHeadId,'/report/archivesRedHeadReport.do');
		//运营公司发总公司文(请示)
		ProRunMap.put(FlowDefIdPro.ReportToConComId,'/report/archivesRedHeadQingShiReport.do');
		
		//运营公司对总公司发文(工作联系单)
		ProRunMap.put(FlowDefIdPro.OuterWorkConnId,'/report/archivesWorkConnReport.do');
		
		//-------------------------------------------------------V1.0---------------------------------------------------------------
		//文件会签单-发文V1.0
		ProRunMap.put(FlowDefIdPro.FileHuiQianId_V1,'/report/archivesFileHuiQianV1Report.do');
		//文本评审单-发文V1.0
		ProRunMap.put(FlowDefIdPro.FilePingShenId_V1,'/report/archivesDocumentReviewV1Report.do');
		//红头文件-会议纪要_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdHYJY_V1,'/report/archivesRedHeadHYJYReport.do');
		//红头文件-运营公司内发文_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdNFW_V1,'/report/archivesRedHeadNFWReport.do');
		//红头文件-请示_V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdQS_V1,'/report/archivesRedHeadQSReport.do');
		//红头文件-运营公司外发文__V1.0
		ProRunMap.put(FlowDefIdPro.RedHeadIdWFW_V1,'/report/archivesRedHeadWFWReport.do');
	//报运营会议材料审批_V1.0
		ProRunMap.put(FlowDefIdPro.JingYingBanZiHuiId_V1,'/report/archivesJingYingBanZiHuiV1Report.do');
		//运营公司报总公司上会材料审批_V1.0
		ProRunMap.put(FlowDefIdPro.YyToCenterCompanyId_V1,'/report/archivesYyToCenterCompanyV1Report.do');
		//内部工作联系单-发文V1.0
		ProRunMap.put(FlowDefIdPro.InnerWorkConnId_V1,'/report/archivesInnerWorkConnReport.do');
		//内部工作联系单-收文V1.0
		ProRunMap.put(FlowDefIdPro.InnerWorkConnReceiveId_V1,'/report/archivesInnerWorkReceiveConnReport.do');
		//运营公司对外单位工作联系单_V1.0
		ProRunMap.put(FlowDefIdPro.OuterWorkConnId_V1,'/report/archivesWorkConnV1Report.do');	
		//运营公司外收文_V1.0
		ProRunMap.put(FlowDefIdPro.ArchivesReceiveOutsideId_V1,'/report/archivesReceiveOutsideReport.do');
		
		//发集团公司文_v1.0 20121019
		ProRunMap.put(FlowDefIdPro.reportToGenComId,'/report/archivesRedHeadWFWReport.do');
		
		//ComboBox 
		var comboType = new Ext.form.ComboBox({
			fieldLabel : '类型',
			hiddenName : 'Q_type_S_EQ',
			xtype : 'combo',
			editable : false,
			allowBlank : true,
			triggerAction : 'all',
			displayField : 'typename',
			valueField : 'id',
			mode : 'local',
			width:150,
			store:[['','全部'],['creator','我发起的'],['takepart','我参与的'],['cc','阅知给我的']],
		    listeners:{
	         'load': function(){
				comboType.setValue('');
				}
		    }
		});
		
		// 初始化搜索条件Panel
		this.searchPanel = new HT.SearchPanel( {
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel:'流程名称',
				hiddenName : 'proTypeId',
				width : 150,
				xtype : 'combo',
				// xtype : 'numberfield',
				mode : 'local',
				listWidth: 400,
				editable : false,
				resizable : true,
				triggerAction : 'all',
				displayField : 'name',
				valueField : 'defId',
				store : new Ext.data.SimpleStore(
				{
					autoLoad : true,
					url : __ctxPath + '/flow/comIncludeRecvProDefinition.do',
					fields : [ 'defId','name' ]
					           }
				   )			
		},
//		{
//
//				fieldLabel : '发起部门:',
//				hiddenName : 'Q_issueDep_S_EQ',
//				id : 'comboproTPRptissuedepall',
//				flex : 1,
//				width : 150,
//				xtype : 'combo',
//				editable : false,
//				allowBlank : true,
//				triggerAction : 'all',
//				displayField : 'depname',
//				valueField : 'depname',
//				mode : 'local',
//				store : new Ext.data.SimpleStore(
//						{
//							autoLoad : true,
//							url : __ctxPath + '/system/comboDep3AllDepartment.do',
//							fields : [ 'depid',
//									'depname' ]
//						})			
//			},
		{
			fieldLabel : '发文单位:',
			name : 'Q_issueDep_S_LK',
			flex : 1,
			xtype : 'textfield',
			width:150
		},	
		{
				fieldLabel : '发起人:',
				name : 'Q_creator_S_LK',
				flex : 1,
				xtype : 'textfield',
				width:150
			} ,{
				fieldLabel : '开始日期',
				id:'queryTPStartDate',
				name : 'Q_createtime_D_GT',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d',
				editable:false,
				value:reduceByTransDate((new Date()).pattern('yyyy-MM-dd'),7),
				width:150
			}, {
				fieldLabel : '截止日期:',
				id:'queryTPEndDate',
				name : 'Q_createtime_D_LT',
				flex : 1,
				xtype : 'datefield',
				format : 'Y-m-d',
				editable:false,
				value:new Date(),
				width:150
			}, {
				fieldLabel : '主　题:',
				name : 'Q_subject_S_EQ',
				flex : 1,
				xtype : 'textfield',
				width:150
			} ],
			buttons : [ {
				text : '查询',
				scope : this,
				iconCls : 'btn-search',
				handler : this.search
			}, {
				text : '重置',
				scope : this,
				iconCls : 'btn-reset',
				handler : this.reset
			} ]
		});// end of searchPanel

		this.gridPanel = new HT.GridPanel( {
			region : 'center',
			//tbar : this.topbar,
			// 不使用RowActions
			noSel:true,
			rowActions : false,
			id : 'ProcessTPReportGrid',
			url : __ctxPath + '/flow/listallProcessReport.do?queryStartDate='+
							(reduceByTransDate((new Date()).pattern('yyyy-MM-dd'),7))+
							'&queryEndDate='+(new Date()).pattern('yyyy-MM-dd')+'&Q_type_S_EQ=takepart',
			fields : [ {
				name : 'defid',
				type : 'int'
			}, 'createtime', 'userid', 'creator', 'issuedep','subject','name',
			'runid','piid','archivesid','datavalue',
					'runStatus'],
			columns : [ {
				header : 'defid',
				dataIndex : 'defid',
				hidden : true
			}, 
			 {
				header : '流程名称',
				dataIndex : 'name',
				width : 150
			}, {
				header : '发起人',
				dataIndex : 'creator',
				width : 50
			}, {
				header : '发文单位',
				dataIndex : 'issuedep'
			},{
				header : '发起时间',
				dataIndex : 'createtime'/*,
                renderer:function(val){
                    return new Date(val).format('Y-m-d H:i:s');
                }*/
			},  {
				header : '主题',
				dataIndex : 'subject',
				width : 300,
				renderer : function(value, metadata, record, rowIndex,colIndex) {
			        metadata.attr='ext:qtitle="" ext:qtip="'+value+'" style="cursor:pointer;"';
			        return value;
		        }
			}, {
				header : 'runid',
				dataIndex : 'runid',
				hidden:true
			},{
				header : 'archivesid',
				dataIndex : 'archivesid',
				hidden:true
			},{
				header : 'datavalue',
				dataIndex : 'datavalue',
				hidden:true
			},{
				header : 'piid',
				dataIndex : 'piid',
				hidden:true
			},
			{
				header : '操作',
				dataIndex : 'runid',
				width:150,
				renderer:function(value, metadata, record, rowIndex,
						colIndex){
					var runid = record.data.runid;
					var defid = record.data.defid;
					var piid = record.data.piid;
					var subject = record.data.subject;
					var archivesurl = record.data.datavalue;
					var runStatus = record.data.runStatus;
					var archivesid=record.data.archivesid;
					var str = '';
					str+='<a href="#"  onclick="ProcessTPReportView.detail('
										+ runid + ','+defid+',\''+piid+'\',\''+subject+'\')">审批信息</a>';
					if (runid != '0')
                    {
                        if (archivesurl!=" ")
                        {
                            str+='&nbsp;<a href="#"  onclick="ProcessTPReportView.archdetailpage(\''+archivesurl+'\','
                            + runid +')">表单信息</a>';                                            
                        }
                        else
                        {
                            str+='&nbsp;<a href="#"  onclick="ProcessTPReportView.archdetail('
                            + runid +','+ archivesid+')">表单信息</a>';                                            
                        }
                    }
					var postUrl = ProRunMap.get(defid);
					//runStatus == 2  流程已经结束   ==3 流程已经终止
					if (postUrl != "" && postUrl != undefined && (runStatus=='2' || runStatus == '3')) {
						str += '&nbsp;<a href="' + __ctxPath +postUrl+'?runId='+runid+'" target="_blank">打印</a>';
					}
					return str;
				}
				
			}]
		// end of columns
				});

		//this.gridPanel.addListener('rowdblclick', this.rowClick);

	},// end of the initComponents()
	// 重置查询表单
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	// 按条件搜索
	search : function() {
		$search( {
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	},
	// GridPanel行点击处理事件
	rowClick : function(grid, rowindex, e) {
		grid.getSelectionModel().each(function(rec) {
			new ProcessReportForm( {
				defid : rec.data.defid
			}).show();
		});
	},
	// 创建记录
	createRs : function() {
		new ProcessReportForm().show();
	},
	// 按ID删除记录
	removeRs : function(id) {
		$postDel( {
			url : __ctxPath + '/flow/multiDelProcessReport.do',
			ids : id,
			grid : this.gridPanel
		});
	},
	// 把选中ID删除
	removeSelRs : function() {
		$delGridRs( {
			url : __ctxPath + '/flow/multiDelProcessReport.do',
			grid : this.gridPanel,
			idName : 'defid'
		});
	},
	// 编辑Rs
	editRs : function(record) {
		new ProcessReportForm( {
			defid : record.data.defid
		}).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col) {
		switch (action) {
		case 'btn-del':
			this.removeRs.call(this, record.data.defid);
			break;
		case 'btn-edit':
			this.editRs.call(this, record);
			break;
		default:
			break;
		}
	}
});

/**
 * 显示明细
 * @param {} runId
 * @param {} name
 */
ProcessTPReportView.detail=function(runId,defId,piId,name){
	new ProcessReportForm({
			runid:runId,
			defid:defId,
			piid:piId,
			name:name
		}).show();		
};

ProcessTPReportView.archdetailpage = function(url,runId){
//    var archId = ProcessTPReportView.getArchId(runId);
//    if(-1!=archId){
	var archId;
    Ext.Ajax.request({
        url : __ctxPath + '/archive/getArchIdArchives.do',
        params : {
            runId : runId
        },
        //async:false,
        method : 'post',
        success : function(res,opt){
            var obj = Ext.util.JSON.decode(res.responseText);
            archId = obj.archivesId;
            if(-1!=archId){
		        new ArchivesDetailUrlWin({
					archivesId:archId,
					archivesurl:url
				}).show();
    		}
            
        },
        failure : function(){
            archId = -1;
        }
    });
//    }
	
};

ProcessTPReportView.archdetail = function(runId,archivesid) {
    //var archId = ProcessTPReportView.getArchId(runId);
    //if(-1!=archId){
        new ArchivesDetailWin({
                archivesId : archivesid
            }).show();
   // }
};
ProcessTPReportView.getArchId = function(runId){
    var archId;
    Ext.Ajax.request({
        url : __ctxPath + '/archive/getArchIdArchives.do',
        params : {
            runId : runId
        },
        async:false,
        method : 'post',
        success : function(res,opt){
            var obj = Ext.util.JSON.decode(res.responseText);
            archId = obj.archivesId;            
                       
        },
        failure : function(){
            archId = -1;
        }
    });
    return archId; 
};
