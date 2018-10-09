package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.LeaderReadDao;
import com.gdssoft.oa.model.archive.ArchivesDoc;
import com.gdssoft.oa.model.archive.LeaderRead;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class LeaderReadDaoImpl extends BaseDaoImpl<LeaderRead> implements LeaderReadDao{

	public LeaderReadDaoImpl() {
		super(LeaderRead.class);
	}
	public List<LeaderRead> findByAid(Long archivesId,String checkName) {
		String hql="from LeaderRead vo where vo.archives.archivesId=? and vo.checkName=? ";
		Object [] objs={archivesId,checkName};
		return findByHql(hql, objs);
	}

}