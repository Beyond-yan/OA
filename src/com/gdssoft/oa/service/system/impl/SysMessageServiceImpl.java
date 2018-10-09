package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/

import com.gdssoft.oa.dao.system.SysMessageDao;
import com.gdssoft.oa.model.system.SysMessage;
import com.gdssoft.oa.service.system.SysMessageService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class SysMessageServiceImpl extends BaseServiceImpl<SysMessage> implements SysMessageService{
	private SysMessageDao dao;
	
	public SysMessageServiceImpl(SysMessageDao dao) {
		super(dao);
		this.dao=dao;
	}


}