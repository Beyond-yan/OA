package com.gdssoft.oa.dao.system.impl;
/*
 *  广州宏天软件有限公司 J.Office协同办公管理系统   -- http://www.jee-soft.cn
 *  Copyright (C) 2008-2010 GuangZhou HongTian Software Limited Company.
*/
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.compass.core.util.asm.tree.IntInsnNode;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.oa.dao.system.AppTeamDao;
import com.gdssoft.oa.model.system.AppTeam;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;

@SuppressWarnings("unchecked")
public class AppTeamDaoImpl extends BaseDaoImpl<AppTeam> implements AppTeamDao{

	public AppTeamDaoImpl() {
		super(AppTeam.class);
	}

	@Override
	public List<AppUser> getMembers(String teamId, String start,
			String limit) {
		String schema= ContextUtil.getCurrentUser().getOwnerSchema();
		String sql="select u.* from "+schema+".USER_TEAM t join  "+schema+".APP_USER u ON t.USERID=u.USERID WHERE t.TEAMID="+teamId;
		Query query = this.getSession().createSQLQuery(sql).addEntity(AppUser.class).setFirstResult(new Integer(start)).setMaxResults(new Integer(limit));
		return query.list();
	}

}