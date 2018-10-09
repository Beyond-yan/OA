package com.gdssoft.oa.service.communicate.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import com.gdssoft.oa.dao.communicate.OutMailUserSetingDao;
import com.gdssoft.oa.model.communicate.OutMailUserSeting;
import com.gdssoft.oa.service.communicate.OutMailUserSetingService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class OutMailUserSetingServiceImpl extends BaseServiceImpl<OutMailUserSeting> implements OutMailUserSetingService{
	private OutMailUserSetingDao dao;
	
	public OutMailUserSetingServiceImpl(OutMailUserSetingDao dao) {
		super(dao);
		this.dao=dao;
	}
	public OutMailUserSeting getByLoginId(Long loginid){
		return dao.getByLoginId(loginid);
	}

}