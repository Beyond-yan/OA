RoomUserHistory = Ext.extend(Ext.Window,
{
	// 构造函数
	constructor : function(_cfg)
	{
		Ext.applyIf(this, _cfg);
		// 初始化组件
		this.initUIComponents();
		// 调用父类构造
		RoomUserHistory.superclass.constructor.call(this,
		{
			id : 'RoomUserHistoryView',
			title : '历史记录',
			region : 'center',
			height : 400,
			width : 800,
			layout : 'fit',
			items : [ this.gridPanel ]
		});
	},// end of constructor

	// 初始化组件
	initUIComponents : function()
	{
		this.gridPanel = new HT.GridPanel(
		{
			region : 'center',
			id : 'ProUserRoomGrid',
			noSel:true,
			url : __ctxPath + "/operations/getUserHistoryProDormRoom.do?id=" + this.roomid,
			fields : [
			{
				name : 'id',
				type : 'int',
				mapping:'appUser.id'
			},
			{
				name : 'code',
				mapping : 'proDormRoom.code'
			},
			{
				name : 'fullname',
				mapping : 'appUser.fullname'
			},
			{
				name : 'username',
				mapping : 'appUser.username'
			},
			{
				name : 'depName',
				mapping : 'appUser.department.depName'
			}, 'applyId', 'userCode', 'roomId', 'checkInTime', 'checkOutTime',
					'isCheckOut', 'ref1', 'ref2', 'ref3', 'createDate',
					'createBy', 'updateDate', 'updateBy' ],
			columns : [
			{
				header : 'id',
				dataIndex : 'id',
				hidden : true
			},
			{
				header : '员工姓名',
				dataIndex : 'fullname'
			},
			{
				header : '所在部门',
				dataIndex : 'depName'
			},
			{
				header : '房间号',
				dataIndex : 'code'
			},
			{
				header : '入住时间',
				dataIndex : 'checkInTime'
			},
			{
				header : '退宿时间',
				dataIndex : 'checkOutTime'
			},
			{
				header : '是否退宿',
				dataIndex : 'isCheckOut',
				renderer : function(value)
				{
					if (value == '1')
					{
						return '未退宿';
					}
					if (value == '2')
					{
						return '已退宿';
					}

				}
			},
			{
				header : '缴费记录',
				dataIndex : 'roomId',
				width : 100,
				renderer : function(val, p, record)
				{
					var uid = record.data.id;
					var rid = record.data.roomId;						
					var str='';
					str += '<button title="浏览" value=" " class="btn-apply" onclick="RoomUserHistory.ViewHis(' + uid + ','+rid+')">&nbsp</button>';
					return str;
				}
			}			
			]
		// end of columns
				});
		
		
	},// end of the initComponents()
	

	viewFeeHis:function(record)
	{
		new RoomUserFeeHistory(
				{
					userid : record.data.id,
					roomid:  this.roomid
				}
		).show();
	},
	// 行的Action
	onRowAction : function(grid, record, action, row, col)
	{
		switch (action)
		{
			case 'btn-apply':
				this.viewFeeHis.call(this, record);
				break;				
			default:
				break;
		}
	}
});


RoomUserHistory.ViewHis = function(uid,roomid)
{
	new RoomUserFeeHistory(
			{
				userid :uid,
				roomid: roomid
			}
	).show();
};
