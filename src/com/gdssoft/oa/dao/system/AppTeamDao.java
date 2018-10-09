package com.gdssoft.oa.dao.system;
/*
 *  广州宏天软件有限公司 J.Office协同办公管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2010 GuangZhou HongTian Software Limited Company.
*/
import java.util.List;
import java.util.Map;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.oa.model.system.AppTeam;
import com.gdssoft.oa.model.system.AppUser;

/**
 * 
 * @author 
 *
 */
public interface AppTeamDao extends BaseDao<AppTeam>{

	List<AppUser> getMembers(String teamId, String start,
			String limit);
	
}