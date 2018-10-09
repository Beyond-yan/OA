package com.gdssoft.oa.action.personal;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Set;
import javax.annotation.Resource;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import java.util.Calendar;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.personal.VPersonalcardinfo;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.personal.VPersonalcardinfoService;
import flexjson.DateTransformer;
import flexjson.JSONSerializer;

public class VPersonalcardinfoAction extends BaseAction {
	@Resource
	VPersonalcardinfoService vPersonalcardinfoService;
	Log log = LogFactory.getLog("VPersonalcardinfoAction");
	private SimpleDateFormat sdf_date = new SimpleDateFormat("yyyy-MM-dd");	
	public String shPercardinfo() {
		log.info("餐卡查询：");
		AppUser user=ContextUtil.getCurrentUser();
		QueryFilter filter=new QueryFilter(getRequest()); 		
		if ((getRequest().getParameter("Q_useTime_D_GE")==null)&&(getRequest().getParameter("Q_useTime_DG_LE")==null)){
			Calendar startcalendar=Calendar.getInstance();
			startcalendar.setTime(new Date()); 
			startcalendar.set(Calendar.DAY_OF_MONTH, 1);
			Calendar endCalendar=(Calendar) startcalendar.clone();
			endCalendar.add(Calendar.MONTH, 1);
			endCalendar.add(Calendar.DAY_OF_MONTH, -1);
			String start=sdf_date.format(startcalendar.getTime());
			String end=sdf_date.format(endCalendar.getTime());
			System.out.println("--start----"+start);
			System.out.println("--end----"+end);			
			filter.addFilter("Q_useTime_D_GE", start);
			filter.addFilter("Q_useTime_DG_LE", end);
		}
		List<VPersonalcardinfo> list=null;		
		Set<AppRole> roles = user.getRoles();
		boolean isAdmin = false;
		for(AppRole role:roles)
		{
			if (role.getRoleId() == -1L)//管理员权限
			{
				isAdmin = true;
				continue;
			}		
		}				
		if ((!isAdmin))//非管理员需要过滤		
		{
			filter.addFilter("Q_username_S_EQ", user.getUsername());
		}	
		filter.addSorted("useTime", "desc");
		// TODO Auto-generated method stub
		list=vPersonalcardinfoService.getAll(filter);
		//list=vPersonalcardinfoService.searchVPersonalcardinfoList(form, to);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		JSONSerializer serializer=new JSONSerializer();
		serializer.transform(new DateTransformer("yyyy-MM-dd"), "useTime");
		buff.append(serializer.exclude(new String[] { "class" }).serialize(list));		

		buff.append("}");
		System.out.println("----buff.toString:" + buff.toString());
		jsonString=buff.toString();
		log.info("餐卡结束。");
		return SUCCESS;
	}

}
