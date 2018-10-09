package com.gdssoft.oa.dao.archive.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.archive.ArchRecTypeDao;
import com.gdssoft.oa.model.archive.ArchRecType;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ArchRecTypeDaoImpl extends BaseDaoImpl<ArchRecType> implements ArchRecTypeDao{

	public ArchRecTypeDaoImpl() {
		super(ArchRecType.class);
	}

}