package com.gdssoft.oa.job;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.util.DateUtil;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.oa.model.personal.PersonnelCardHistory;
import com.gdssoft.oa.model.admin.CartRepair;
import com.gdssoft.oa.model.personal.Duty;
import com.gdssoft.oa.model.personal.DutyRegister;
import com.gdssoft.oa.model.personal.DutySection;
import com.gdssoft.oa.model.personal.DutySystem;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.service.personal.PersonnelCardHistoryService;
import com.gdssoft.oa.service.admin.CartRepairService;
import com.gdssoft.oa.service.personal.DutyRegisterService;
import com.gdssoft.oa.service.personal.DutySectionService;
import com.gdssoft.oa.service.personal.DutyService;
import com.gdssoft.oa.service.personal.DutySystemService;
import com.gdssoft.oa.service.system.AppUserService;

/**
 * 
 * 定时遍历车辆维修表数据
 * 
 * @author f7400185
 * 
 */
public class DutyRegisterJob extends BaseAction {
	private static Log logger = LogFactory.getLog(DutyRegisterJob.class);

	public DutyRegisterService dutyRegisterService;

	public void setDutyRegisterService(DutyRegisterService dutyRegisterService) {
		this.dutyRegisterService = dutyRegisterService;
	}
	
	public DutyService dutyService;
	
	public void setDutyService(DutyService dutyService) {
		this.dutyService = dutyService;
	}

	public DutySectionService dutySectionService;
	
	public void setDutySectionService(DutySectionService dutySectionService) {
		this.dutySectionService = dutySectionService;
	}
	
	public PersonnelCardHistoryService personnelCardHistoryService;

	public void setPersonnelCardHistoryService(
			PersonnelCardHistoryService personnelCardHistoryService) {
		this.personnelCardHistoryService = personnelCardHistoryService;
	}

	public AppUserService appUserService;
	
	public void setAppUserService(AppUserService appUserService) {
		this.appUserService = appUserService;
	}

	public  DutySystemService dutySystemService;
	
	public void setDutySystemService(DutySystemService dutySystemService) {
		this.dutySystemService = dutySystemService;
	}

	public void doWork() {
		signIn();
	}

	/**
	 * 
	 * 签到
	 * 
	 * 
	 * */
	@SuppressWarnings("deprecation")
	private void signIn() {
		
		//获取所有的班次  查询第一次数据库
		List<DutySection> list= dutySectionService.getAllDutySection();
		//循环班次
		for(DutySection dutySectionTemp:list) {
			
			Calendar calendar1 = Calendar.getInstance(); // 获得一个日历
			Date currentDate = new Date();
			int year = currentDate.getYear()+1900;
			int month = currentDate.getMonth();
			int day = currentDate.getDate();
			calendar1.set(year, month, day-1,dutySectionTemp.getStartSignin().getHours(), dutySectionTemp.getStartSignin().getMinutes(), dutySectionTemp.getStartSignin().getSeconds());
			
			Calendar calendar2 = Calendar.getInstance(); // 获得一个日历
			Date currentDate2 = new Date();
			int year2 = currentDate.getYear()+1900;
			int month2 = currentDate.getMonth();
			int day2 = currentDate.getDate();
			calendar2.set(year2, month2, day2-1,dutySectionTemp.getEndSignin().getHours(), dutySectionTemp.getEndSignin().getMinutes(), dutySectionTemp.getEndSignin().getSeconds());
			//获取该班次上班时间段的所有刷卡记录
			List<PersonnelCardHistory> pchList = personnelCardHistoryService.getSignRecores(calendar1.getTime(), calendar2.getTime());
			System.out.println("pchList:"+pchList.size());
			logger.debug("班次"+dutySectionTemp.getSectionId()+":上班时间段的所有刷卡记录数为"+pchList.size());
			signInService(dutySectionTemp,pchList);
			
			Calendar calendar3 = Calendar.getInstance(); // 获得一个日历
			calendar3.set(year, month, day-1,dutySectionTemp.getEarlyOffTime().getHours(), dutySectionTemp.getEarlyOffTime().getMinutes(), dutySectionTemp.getEarlyOffTime().getSeconds());
			
			Calendar calendar4 = Calendar.getInstance(); // 获得一个日历
			if(dutySectionTemp.getDutyEndTime().compareTo(dutySectionTemp.getDutyStartTime())<0){
				calendar4.set(year, month, (day-1)+1,dutySectionTemp.getSignOutTime().getHours(), dutySectionTemp.getSignOutTime().getMinutes(), dutySectionTemp.getSignOutTime().getSeconds());
			}else{
				calendar4.set(year, month, day-1,dutySectionTemp.getSignOutTime().getHours(), dutySectionTemp.getSignOutTime().getMinutes(), dutySectionTemp.getSignOutTime().getSeconds());
			}
			
			//获取该班次下班时间段的所有刷卡记录
			List<PersonnelCardHistory> pchList2 = personnelCardHistoryService.getSignOffRecores(calendar3.getTime(), calendar4.getTime());
			logger.debug("班次"+dutySectionTemp.getSectionId()+":下班时间段的所有刷卡记录数为"+pchList2.size());
			signOutService(dutySectionTemp,pchList2);
			
		}

	}
	
	public void signInService(DutySection dutySectionTemp,List<PersonnelCardHistory> pchList){
		for(PersonnelCardHistory pch:pchList){
			//AppUser curUser= appUserService.get(pch.getUserId());
			System.out.println("pch.getEmpCode()"+pch.getEmpCode());
			AppUser curUser= appUserService.findByUserName(pch.getEmpCode());
			if(curUser!=null){
				DutySystem dutySystem=null;
				//取到当前用户的班次
				Duty duty=dutyService.getCurUserDuty(pch.getUserId());
				if(duty!=null){
					dutySystem=duty.getDutySystem();
				}else{
					dutySystem=dutySystemService.getDefaultDutySystem();
				}
				if(dutySystem==null){
					logger.debug("尚未为用户设置排班，请联系管理员!");
				}else{
					String dutySetting=dutySystem.getSystemSetting();
					logger.debug("dutySetting:"+dutySetting);
					//分割为7天
					String[] day7Sections=dutySetting.split("[|]");
					
					Calendar curCal=Calendar.getInstance();
					//取到当前为几天
					int curDay=curCal.get(Calendar.DAY_OF_WEEK);
					//当天的班制
					String[] curDaySections=day7Sections[curDay-2].split("[,]");
				
					for(int i=0;i<curDaySections.length;i++){
						if("-".equals(curDaySections[i])){//-代表休息
							continue;
						}
						DutySection dutySection=dutySectionService.get(new Long(curDaySections[i]));
						//System.out.println(dutySection.getSectionId());
						//System.out.println(dutySectionTemp.getSectionId());
						if(dutySection.getSectionId().intValue() ==dutySectionTemp.getSectionId().intValue() ){
							logger.debug("开始签到");
							//进行自动签到
							dutyRegisterService.signInOff(dutySection.getSectionId(),DutyRegister.SIGN_IN,curUser,pch.getRecordDt());
						}
					}
				}
			}
			
		}
	}
	
	public void signOutService(DutySection dutySectionTemp,List<PersonnelCardHistory> pchList){
		for(PersonnelCardHistory pch:pchList){
			System.out.println("pch.getUserId()"+pch.getUserId());
			//AppUser curUser= appUserService.get(pch.getUserId());
			AppUser curUser= appUserService.findByUserName(pch.getEmpCode());
			if(curUser!=null){
				DutySystem dutySystem=null;
				//取到当前用户的班次
				Duty duty=dutyService.getCurUserDuty(pch.getUserId());
				if(duty!=null){
					dutySystem=duty.getDutySystem();
				}else{
					dutySystem=dutySystemService.getDefaultDutySystem();
				}
				if(dutySystem==null){
					logger.debug("尚未为用户设置排班，请联系管理员!");
				}else{
					String dutySetting=dutySystem.getSystemSetting();
					logger.debug("dutySetting:"+dutySetting);
					//分割为7天
					String[] day7Sections=dutySetting.split("[|]");
					
					Calendar curCal=Calendar.getInstance();
					//取到当前为几天
					int curDay=curCal.get(Calendar.DAY_OF_WEEK);
					//当天的班制
					String[] curDaySections=day7Sections[curDay-2].split("[,]");
				
					for(int i=0;i<curDaySections.length;i++){
						if("-".equals(curDaySections[i])){//-代表休息
							continue;
						}
						DutySection dutySection=dutySectionService.get(new Long(curDaySections[i]));
						//System.out.println(dutySection.getSectionId());
						//System.out.println(dutySectionTemp.getSectionId());
						if(dutySection.getSectionId().intValue() ==dutySectionTemp.getSectionId().intValue() ){
							logger.debug("开始签退");
							//进行自动签到
							dutyRegisterService.signInOff(dutySection.getSectionId(),DutyRegister.SIGN_OFF,curUser,pch.getRecordDt());
						}
					}
				}
			}
			
		}
			
	}

}