package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import com.gdssoft.oa.dao.hrm.ResumeDao;
import com.gdssoft.oa.model.hrm.Resume;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class ResumeDaoImpl extends BaseDaoImpl<Resume> implements ResumeDao{

	public ResumeDaoImpl() {
		super(Resume.class);
	}

}