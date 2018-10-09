package com.gdssoft.oa.action.personal;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.oa.action.flow.FlowRunInfo;
import com.gdssoft.oa.action.flow.ProcessActivityAssistant;
import com.gdssoft.oa.model.flow.ProDefinition;
import com.gdssoft.oa.model.flow.ProcessForm;
import com.gdssoft.oa.model.flow.ProcessRun;
import com.gdssoft.oa.model.personal.ErrandsRegister;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.flow.JbpmService;
import com.gdssoft.oa.service.flow.ProcessRunService;
import com.gdssoft.oa.service.personal.ErrandsRegisterService;
import com.gdssoft.oa.service.system.AppUserService;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.gdssoft.core.Constants;
import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.jbpm.pv.ParamField;
import com.gdssoft.core.util.BeanUtil;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.DateUtil;
import com.gdssoft.core.util.JsonUtil;
import com.gdssoft.core.web.action.BaseAction;



import flexjson.JSONSerializer;
/**
 * 
 * @author 
 *
 */
public class ErrandsRegisterAction extends BaseAction{
	
	@Resource
	private ProcessRunService processRunService;
	
	@Resource
	private JbpmService jbpmService;
	
	@Resource
	private AppUserService appUserService;
	
	@Resource
	private ErrandsRegisterService errandsRegisterService;
	private ErrandsRegister errandsRegister;
	
	private Long dateId;

	public Long getDateId() {
		return dateId;
	}

	public void setDateId(Long dateId) {
		this.dateId = dateId;
	}

	public ErrandsRegister getErrandsRegister() {
		return errandsRegister;
	}

	public void setErrandsRegister(ErrandsRegister errandsRegister) {
		this.errandsRegister = errandsRegister;
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		filter.addFilter("Q_appUser.userId_L_EQ", ContextUtil.getCurrentUserId().toString());
		List<ErrandsRegister> list= errandsRegisterService.getAll(filter);
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");		
		
		JSONSerializer serializer=JsonUtil.getJSONSerializer("startTime","endTime");
		buff.append(serializer.serialize(list));
		
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		
		String[]ids=getRequest().getParameterValues("ids");
		if(ids!=null){
			for(String id:ids){
				errandsRegisterService.remove(new Long(id));
			}
		}
		
		jsonString="{success:true}";
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		ErrandsRegister errandsRegister=errandsRegisterService.get(dateId);
		
		Gson gson=new GsonBuilder().setDateFormat("yyyy-MM-dd HH:mm:ss").create();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(errandsRegister));
		sb.append("}");
		setJsonString(sb.toString());
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		//是否为新记录
//		boolean isNew=errandsRegister.getDateId()==null? true:false;
		
		if(errandsRegister.getDateId()!=null){
			
			ErrandsRegister org=errandsRegisterService.get(errandsRegister.getDateId());
			
			try{
				BeanUtil.copyNotNullProperties(org, errandsRegister);
				errandsRegisterService.save(org);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
			
		}else{
			errandsRegister.setAppUser(ContextUtil.getCurrentUser());
			errandsRegister.setStatus((short)0);//未通过
			errandsRegisterService.save(errandsRegister);
			
			Map<String,ParamField> fieldMap=constructStartFlowMap(errandsRegister);
			//取得请假流程的定义
			ProDefinition proDefintion=jbpmService.getProDefinitionByKey(Constants.FLOW_LEAVE_KEY);
			
			if(proDefintion!=null){
				ProcessRun processRun=processRunService.initNewProcessRun(proDefintion,null);
				//流程的启动表单信息
				ProcessForm processForm=new ProcessForm();
				processForm.setActivityName("开始");
				processForm.setProcessRun(processRun);
				
				//流程启动的信息
				FlowRunInfo runInfo=new FlowRunInfo();
				runInfo.setParamFields(fieldMap);
				runInfo.setStartFlow(true);
				//设置审批人
				runInfo.setdAssignId(errandsRegister.getApprovalId().toString());
				//启动流程
				processRunService.saveProcessRun(processRun, processForm,runInfo);
				
			}else{
				logger.error("请假流程没有定义！");
			}
		}

		setJsonString("{success:true}");
		return SUCCESS;
	}
	
	public String getTotalYhDays(){
		double days =computeYhdays();
		//取得申请人
		setJsonString("{success:true,data:"+days+"}");
		return SUCCESS;
	}
	
	public double computeYhdays(){
		Long userId= Long.valueOf(getRequest().getParameter("userId"));
		AppUser appUser = appUserService.get(userId);
		//Date attendWorkDate = appUser.getAttendWorkDate();
		Date attendWorkDate = appUser.getBirthday();
		Calendar dayBegin = Calendar.getInstance();
		dayBegin.setTime(attendWorkDate);
		Calendar dayEnd = Calendar.getInstance();	
		dayEnd.setTime(new Date());
		double yearHolidays = 0;
		//取得工龄
		int serviceYears = MonthDays(dayBegin,dayEnd)/12;
		if(serviceYears>=1 && serviceYears<10 ){
			yearHolidays = 5;
		}else if(yearHolidays>=10 && yearHolidays<20){
			yearHolidays = 10;
		}else if(yearHolidays>=20){
			yearHolidays = 15;
		}else if(serviceYears==0){
			yearHolidays = (dateInterval(attendWorkDate.getTime(),new Date().getTime())/365d)*5;
		}
		return yearHolidays;
	}
	
	public  int dateInterval(long date1, long date2) {
		if(date2 > date1){
			date2 = date2 + date1;
			date1 = date2 - date1;
			date2 = date2 - date1;
		}
		/*
		 * Canlendar 该类是一个抽象类 
		 * 提供了丰富的日历字段
		 * 
		 * 本程序中使用到了
		 * Calendar.YEAR	日期中的年份
		 * Calendar.DAY_OF_YEAR		当前年中的天数
		 * getActualMaximum(Calendar.DAY_OF_YEAR) 返回今年是 365 天还是366天
		 */
		Calendar calendar1 = Calendar.getInstance(); // 获得一个日历
		calendar1.setTimeInMillis(date1); // 用给定的 long 值设置此 Calendar 的当前时间值。
		
		Calendar calendar2 = Calendar.getInstance();
		calendar2.setTimeInMillis(date2);
		// 先判断是否同年
		int y1 = calendar1.get(Calendar.YEAR);
		int y2 = calendar2.get(Calendar.YEAR);
		
		int d1 = calendar1.get(Calendar.DAY_OF_YEAR);
		int d2 = calendar2.get(Calendar.DAY_OF_YEAR);
		int maxDays = 0;
		int day = 0;
		if(y1 - y2 > 0){
			day = numerical(maxDays, d1, d2, y1, y2, calendar2);
		}else{
			day = d1 - d2;
		}
		return day;
	}
	/**
	 * 日期间隔计算
	 * 计算公式(示例):
	 * 		20121230 - 20071001
	 * 		取出20121230这一年过了多少天 d1 = 365		取出20071001这一年过了多少天 d2 = 274
	 * 		如果2007年这一年有366天就要让间隔的天数+1，因为2月份有29日。
	 * @param maxDays	用于记录一年中有365天还是366天
	 * @param d1	表示在这年中过了多少天
	 * @param d2	表示在这年中过了多少天
	 * @param y1	当前为2010年
	 * @param y2	当前为2012年
	 * @param calendar	根据日历对象来获取一年中有多少天
	 * @return	计算后日期间隔的天数
	 */
	public  int numerical(int maxDays, int d1, int d2, int y1, int y2, Calendar calendar){
		int day = d1 - d2;
		int betweenYears = y1 - y2;
		List<Integer> d366 = new ArrayList<Integer>();
		
		if(calendar.getActualMaximum(Calendar.DAY_OF_YEAR) == 366){
			System.out.println(calendar.getActualMaximum(Calendar.DAY_OF_YEAR));
			day += 1;
		}
		
		for (int i = 0; i < betweenYears; i++) {
			// 当年 + 1 设置下一年中有多少天
			calendar.set(Calendar.YEAR, (calendar.get(Calendar.YEAR)) + 1);
			maxDays = calendar.getActualMaximum(Calendar.DAY_OF_YEAR);
			// 第一个 366 天不用 + 1 将所有366记录，先不进行加入然后再少加一个
			if(maxDays != 366){
				day += maxDays;
			}else{
				d366.add(maxDays);
			}
			// 如果最后一个 maxDays 等于366 day - 1
			if(i == betweenYears-1 && betweenYears > 1 && maxDays == 366){
				day -= 1;
			}
        }
		
		for(int i = 0; i < d366.size(); i++){
			// 一个或一个以上的366天
			if(d366.size() >= 1){
				day += d366.get(i);
			}
//			else{
//				day -= 1;
//			}
		}
		return day;
	}
	public  int MonthDays(Calendar dayBegin, Calendar dayEnd) {
		
		//初始计算		
        int result= dayEnd.get(Calendar.MONTH) +dayEnd.get(Calendar.YEAR)*12
        -dayBegin.get(Calendar.MONTH) - dayBegin.get(Calendar.YEAR)*12;   
        
        //赋值结束日期的月末             
        Calendar lastDayInEndMonth=Calendar.getInstance();
        lastDayInEndMonth.set(dayEnd.get(Calendar.YEAR),
    		    dayEnd.get(Calendar.MONTH),1);
        lastDayInEndMonth.add(Calendar.MONTH,1);
        lastDayInEndMonth.add(Calendar.DATE,-1);    
        
        // 开始在1日，结束在月末，加一个月
        if((lastDayInEndMonth.get(Calendar.DATE)==dayEnd.get(Calendar.DATE))&&(dayBegin.get(Calendar.DATE)==1)){
        	result += 1;        
        }
        // 如果结束的日期+1<开始日期   并且结束的日期不为月底就扣除一个月
        if((dayEnd.get(Calendar.DATE)+1 < dayBegin.get(Calendar.DATE))&& !(lastDayInEndMonth.get(Calendar.DATE)==dayEnd.get(Calendar.DATE))){
        	result -=1;
        }
        return result;     
	}
	protected Map<String, ParamField> constructStartFlowMap(ErrandsRegister register){
		
		String activityName="开始";
		String processName="请假外出";

		Map<String,ParamField> map=ProcessActivityAssistant.constructFieldMap(processName, activityName);

		ParamField pfDateId=map.get("dateId");
		
		if(pfDateId!=null){
			pfDateId.setValue(register.getDateId().toString());
		}
		
		SimpleDateFormat sdf=new SimpleDateFormat(Constants.DATE_FORMAT_FULL);
		ParamField pfOption=map.get("reqDesc");
		if(pfOption!=null){
			pfOption.setValue(register.getDescp());
		}
		
		ParamField pfStartTime=map.get("startTime");
		if(pfStartTime!=null){
			pfStartTime.setValue(sdf.format(register.getStartTime()));
		}
		
		ParamField pfEndTime=map.get("endTime");
		if(pfEndTime!=null){
			pfEndTime.setValue(sdf.format(register.getEndTime()));
		}
		
		ParamField pfApprovalName=map.get("approvalName");
		if(pfApprovalName!=null){
			pfApprovalName.setValue(register.getApprovalName());
		}

		return map;
	}
	
}
