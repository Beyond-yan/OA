package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.archive.ArchFlowConfDao;
import com.gdssoft.oa.model.archive.ArchFlowConf;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchFlowConfDaoImpl extends BaseDaoImpl<ArchFlowConf> implements ArchFlowConfDao{

	public ArchFlowConfDaoImpl() {
		super(ArchFlowConf.class);
	}

	@Override
	public ArchFlowConf getByFlowType(Short archType) {
		String hql="from ArchFlowConf vo where vo.archType=?";
		Object[] objs={archType};
		List<ArchFlowConf> list=findByHql(hql, objs);
		if(list.size()==1){
			return list.get(0);
		}else{
		    return null;
		}
	}

}