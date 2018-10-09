package com.gdssoft.oa.service.archive.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
 *  Copyright (C)
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.LeaderReadDao;
import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.oa.service.archive.LeaderReadService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class LeaderReadServiceImpl extends BaseServiceImpl<LeaderRead> implements LeaderReadService{
	private LeaderReadDao dao;
	
	public LeaderReadServiceImpl(LeaderReadDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<LeaderRead> findByAid(Long archivesId, String checkName) {
		// TODO Auto-generated method stub
		return this.dao.findByAid(archivesId, checkName);
	}

}