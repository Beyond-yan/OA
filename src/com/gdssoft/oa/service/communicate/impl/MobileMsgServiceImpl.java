package com.gdssoft.oa.service.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.communicate.MobileMsgDao;
import com.gdssoft.oa.model.communicate.MobileMsg;
import com.gdssoft.oa.service.communicate.MobileMsgService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class MobileMsgServiceImpl extends BaseServiceImpl<MobileMsg> implements MobileMsgService{
	private MobileMsgDao dao;
	
	public MobileMsgServiceImpl(MobileMsgDao dao) {
		super(dao);
		this.dao=dao;
	}

}