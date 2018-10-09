package com.gdssoft.oa.service.archive.impl;
/*
 *捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchRecUserDao;
import com.gdssoft.oa.model.archive.ArchRecUser;
import com.gdssoft.oa.service.archive.ArchRecUserService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class ArchRecUserServiceImpl extends BaseServiceImpl<ArchRecUser> implements ArchRecUserService{
	private ArchRecUserDao dao;
	
	public ArchRecUserServiceImpl(ArchRecUserDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List findDepAll() {
		return dao.findDepAll();
	}

	@Override
	public ArchRecUser getByDepId(Long depId) {
		return dao.getByDepId(depId);
	}

}