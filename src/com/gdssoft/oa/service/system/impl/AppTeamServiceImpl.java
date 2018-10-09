package com.gdssoft.oa.service.system.impl;
/*
 *  广州宏天软件有限公司 J.Office协同办公管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2010 GuangZhou HongTian Software Limited Company.
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.oa.dao.system.AppTeamDao;
import com.gdssoft.oa.model.system.AppTeam;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.system.AppTeamService;

public class AppTeamServiceImpl extends BaseServiceImpl<AppTeam> implements AppTeamService{
	@SuppressWarnings("unused")
	private AppTeamDao dao;
	
	public AppTeamServiceImpl(AppTeamDao dao) {
		super(dao);
		this.dao=dao;
	}

	@Override
	public List<AppUser> getMembers(String teamId, String start,
			String limit) {
		return dao.getMembers(teamId,start,limit);
	}

}