JwArchivesView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwArchivesView.superclass.constructor.call(this, {
			id : 'JwArchivesView',
			title : '档案文件查询',
			region : 'center',
			layout : 'border',
			items : [ this.searchPanel, this.gridPanel]
		});
	},
	initUIComponents : function() {
		this.searchPanel = new HT.SearchPanel({
			layout : 'form',
			region : 'north',
			colNums : 3,
			items : [ {
				fieldLabel : '文件标题',
				name : 'Q_subject_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '文号',
				name : 'Q_docnum_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '所属部门',
				name : 'Q_sourcedepartment_S_LK',
				flex : 1,
				xtype : 'textfield'
			},  {
				fieldLabel : '收发类型',
				name : 'Q_doctype_S_LK',
				flex : 1,
				xtype : 'textfield'
			} ,  {
				fieldLabel : '年份',
				name : 'Q_bumfyear_S_LK',
				flex : 1,
				xtype : 'textfield'
			} , 
			{
				fieldLabel : '责任者',
				name : 'Q_burden_S_LK',
				flex : 1,
				xtype : 'textfield'
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
		});
		this.gridPanel = new HT.GridPanel({
			region : 'center',
			id : 'JwArchivesGrid',
			url : __ctxPath + "/jw/listJwArchives.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'subject', 'sourcedepartment', 'page', 'docnum', 'burden',
					'doctype', 'securitydegree', 'day', 'bumfyear', 'keywords',
					'attachcode' ],
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '文件标题',
				dataIndex : 'subject',
				  width:200,
				renderer:function(value, metadata, record, rowIndex,
							colIndex){
						var id=record.data.id;
						var str = '';
						str+='<a href="#"  onclick="JwArchivesView.detail('
							+ id+')">'+value+'</a>';
						return str;
				}
			}, {
				header : '文号',
				dataIndex : 'docnum'
			}, {
				header : '所属部门',
				dataIndex : 'sourcedepartment',
			   width:100
			}, {
				header : '责任者',
				dataIndex : 'burden'
			}, {
				header : '文件日期',
				dataIndex : 'day'
			}, {
				header : '年份',
				dataIndex : 'bumfyear',
				width:50
			}]
		});
	},
	reset : function() {
		this.searchPanel.getForm().reset();
	},
	search : function() {
		$search({
			searchPanel : this.searchPanel,
			gridPanel : this.gridPanel
		});
	}
});
JwArchivesView.detail= function(id) {
	new JwArchivesDetailForm({
		id:id
	}).show();
};