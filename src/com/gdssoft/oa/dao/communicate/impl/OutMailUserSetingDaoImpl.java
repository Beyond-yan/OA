package com.gdssoft.oa.dao.communicate.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.dao.communicate.OutMailUserSetingDao;
import com.gdssoft.oa.model.communicate.OutMailUserSeting;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class OutMailUserSetingDaoImpl extends BaseDaoImpl<OutMailUserSeting> implements OutMailUserSetingDao{

	public OutMailUserSetingDaoImpl() {
		super(OutMailUserSeting.class);
	}
	/*
	 * 根据当前登陆人，取得外部邮箱设置
	 */
	@Override
	public OutMailUserSeting getByLoginId(Long loginid){
		 
		String hql = "select a from OutMailUserSeting a where a.appUser.userId =?";		
		
		List loginList = findByHql(hql,new Object[]{loginid});
		
		if(loginList!=null&&loginList.size()>0){
			return (OutMailUserSeting)loginList.get(0);
		}
		else{
			return null;
		}
	}

}