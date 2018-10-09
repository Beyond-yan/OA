JwSentArchivesView = Ext.extend(Ext.Panel, {
	constructor : function(_cfg) {
		Ext.applyIf(this, _cfg);
		this.initUIComponents();
		JwSentArchivesView.superclass.constructor.call(this, {
			id : 'JwSentArchivesView',
			title : '发文查询',
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
				fieldLabel : '标题',
				name : 'Q_subject_S_LK',
				flex : 1,
				xtype : 'textfield'
			}, {
				fieldLabel : '发文编号',
				name : 'Q_bumfno_S_LK',
				flex : 1,
				xtype : 'textfield'
			},{
				fieldLabel : '发文单位',
				name : 'Q_sourcedepartment_S_LK',
				flex : 1,
				xtype : 'textfield'
			},{
				fieldLabel : '拟稿人',
				name : 'Q_writer_S_LK',
				flex : 1,
				xtype : 'textfield'
			},  {
				fieldLabel : '拟稿部门',
				name : 'Q_bumfDepartment_S_LK',
				flex : 1,
				xtype : 'textfield'
			} ,  {
				fieldLabel : '拟稿日期',
				name : 'Q_bumfday_S_LK',
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
			id : 'JwSentArchivesGrid',
			url : __ctxPath + "/jw/listJwSentArchives.do",
			fields : [ {
				name : 'id',
				type : 'int'
			}, 'subject', 'sourcedepartment',  'bumfday', 'bumfno','bumfDepartment','writer',
					'attachcode' ], 
			columns : [ {
				header : 'id',
				dataIndex : 'id',
				hidden : true
			}, {
				header : '标题',
				dataIndex : 'subject',
				  width:200,
				renderer:function(value, metadata, Sendord, rowIndex,
							colIndex){
						var id=Sendord.data.id;
						var str = '';
						str+='<a href="#"  onclick="JwSentArchivesView.detail('
							+ id+')">'+value+'</a>';
						return str;
				}
			}, {
				header : '发文编号',
				dataIndex : 'bumfno'
			}, {
				header : '发文单位',
				dataIndex : 'sourcedepartment',
			   width:100
			}, {
				header : '拟稿日期',
				dataIndex : 'bumfday'
			}, {
				header : '拟稿人',
				dataIndex : 'writer'
			}, {
				header : '拟稿部门',
				dataIndex : 'bumfDepartment'
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
JwSentArchivesView.detail= function(id) {
	new JwSentArchivesDetailForm({
		id:id
	}).show();
};