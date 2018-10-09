package com.gdssoft.oa.dao.flow.impl;
/*
 *  捷达世软件（深圳）有限公司 Office协同办公管理系统 
 *  Copyright (C) 2008-2010 ShenZhen JieDaShi Software Limited Company.
*/
import java.util.List;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.flow.SealApplyDao;
import com.gdssoft.oa.model.flow.SealApply;

@SuppressWarnings("unchecked")
public class SealApplyDaoImpl extends BaseDaoImpl<SealApply> implements SealApplyDao{

	public SealApplyDaoImpl() {
		super(SealApply.class);
	}
	/**
	 * @category 查询列表
	 * @param sealApply
	 * @return f7400313
	 */
	public List<SealApply> searchSealList(SealApply sealApply){
		List<SealApply> list=null;
		String hql="select vo from SealApply vo inner join vo.processRun pro  inner join vo.appUser app  inner join vo.department dep where 1=1";
		if(sealApply!=null){
			if(sealApply.getApplyUserId()!=null){
				hql+=" and app.userId="+sealApply.getApplyUserId();
			}
			if(sealApply.getDepartmentId()!=null){
				hql+=" and dep.depId="+sealApply.getDepartmentId();
			}
			if(sealApply.getApplyState()!=null){
				hql+=" and pro.runStatus="+sealApply.getApplyState();
			}
		}
		hql+=" order by vo.createDate desc";
		list=findByHql(hql);
		return list;
	}
}