package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/

import com.gdssoft.oa.dao.system.SysMessageDao;
import com.gdssoft.oa.model.system.SysMessage;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class SysMessageDaoImpl extends BaseDaoImpl<SysMessage> implements SysMessageDao{

	public SysMessageDaoImpl() {
		super(SysMessage.class);
	}


}