package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchivesDepDao;
import com.gdssoft.oa.model.archive.ArchivesDep;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchivesDepDaoImpl extends BaseDaoImpl<ArchivesDep> implements ArchivesDepDao{

	public ArchivesDepDaoImpl() {
		super(ArchivesDep.class);
	}
	public List<ArchivesDep> getSentArchsByArchId(Long archivesId) {
		final String hql = "from ArchivesDep a where a.archives.archivesId=?";
		Object[] params ={archivesId};
		return findByHql(hql, params);
	}
	@Override
	public List<ArchivesDep> getByArchAndDep(Long archivesId, Long depId) {
		// TODO Auto-generated method stub
		final String hql = "from ArchivesDep a where a.archives.archivesId=? and a.department.depId=?";
		Object[] params ={archivesId,depId};
		return findByHql(hql, params);
	}
}