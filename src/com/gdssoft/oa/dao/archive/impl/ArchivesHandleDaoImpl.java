package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchivesHandleDao;
import com.gdssoft.oa.model.archive.ArchivesHandle;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchivesHandleDaoImpl extends BaseDaoImpl<ArchivesHandle> implements ArchivesHandleDao{

	public ArchivesHandleDaoImpl() {
		super(ArchivesHandle.class);
	}

	@Override
	public ArchivesHandle findByUAIds(Long userId, Long archiveId) {
		String hql="from ArchivesHandle vo where vo.userId=? and vo.archives.archivesId=?";
		Object [] objs={userId,archiveId};
		List<ArchivesHandle> list=findByHql(hql,objs);
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}

	@Override
	public List<ArchivesHandle> findByAid(Long archiveId) {
		String hql="from ArchivesHandle vo where vo.archives.archivesId=?";
		Object [] objs={archiveId};
		return findByHql(hql,objs);
	}

}