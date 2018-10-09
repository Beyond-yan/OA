package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.Date;
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchHastenDao;
import com.gdssoft.oa.model.archive.ArchHasten;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchHastenDaoImpl extends BaseDaoImpl<ArchHasten> implements ArchHastenDao{

	public ArchHastenDaoImpl() {
		super(ArchHasten.class);
	}

	@Override
	public Date getLeastRecordByUser(Long archivesId) {
		String hql="from ArchHasten vo where vo.archives.archivesId=? order by vo.createtime desc";
		List<ArchHasten> list=findByHql(hql,new Object[]{archivesId});
		if(list.size()>0){
			return list.get(0).getCreatetime();
		}else{
			return null;
		}
	}

}